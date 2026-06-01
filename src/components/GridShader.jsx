import { useRef, useEffect } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`

const FRAGMENT_SRC = `#version 300 es
/*
 * Grid Run shader by Matthias Hurrle (@atzedent)
 * Adapted for Otaku Realm footer — colors shifted to flame/sun palette.
 */
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 move;
uniform vec2 wheel;
#define FC gl_FragCoord.xy
#define R resolution
#define T (time+113.+.2*wheel.y/MN)
#define S smoothstep
#define N normalize
#define MN min(R.x,R.y)
#define hue(a) (.5+.5*sin(3.14*(a)+vec3(0,1,2)))
#define LP vec3(1.+1.*sin(-T),2.-2.*cos(T),-3.-4.*sin(sin(T)))
vec3 render(vec2 uv);
void main() { O=vec4(render((FC-.5*R)/MN),1); }

float smin(float a, float b, float k) {
  k*=log(2.);
  float x=b-a;
  return a+x/(1.-exp2(x/k));
}
float box(vec3 p, vec3 s, float r) {
  p=abs(p)-s+r;
  return length(max(p,.0))+min(.0,max(max(p.x,p.y),p.z))-r;
}
float glow;
float map(vec3 p, bool g) {
  float d=5e5;
  if (g) {
    d=length(p-LP+vec3(.2,.2,0))-.02;
    glow+=.05/(.05+d*d*80.);
  }
  p.z-=T*3.5;
  p=fract(p)-.5;
  vec4 k=vec4(1,.05,.03,.1);
  float r=1e-2;
  return min(d,smin(
    box(p,k.www,r),
    min(
      box(p,k.zxz,r),
      min(box(p,k.xyz,r),box(p,k.yzx,r))
    ),.01
  ));
}
vec3 norm(vec3 p) {
  float h=1e-3; vec2 k=vec2(-1,1);
  return N(
    k.xyy*map(p+k.xyy*h,false)+
    k.yxy*map(p+k.yxy*h,false)+
    k.yyx*map(p+k.yyx*h,false)+
    k.xxx*map(p+k.xxx*h,false)
  );
}
bool march(inout vec3 p, vec3 rd, out float dd, out float at) {
  for (float i; i++<400.;) {
    float d=map(p,true);
    if (abs(d)<1e-3) return true;
    if (d>100.) return false;
    p+=rd*d;
    dd+=d;
    at+=.05*(.05/dd);
  }
}
vec3 dir(vec2 uv, vec3 p, vec3 t, float z) {
  vec3 up=vec3(0,1,0),
  f=N(t-p),
  r=N(cross(up,f)),
  u=N(cross(f,r));
  return mat3(r,u,f)*N(vec3(uv,z));
}
mat3 rotX(float a) {
  float s=sin(a), c=cos(a);
  return mat3(vec3(1,0,0),vec3(0,c,-s),vec3(0,s,c));
}
mat3 rotY(float a) {
  float s=sin(a), c=cos(a);
  return mat3(vec3(c,0,s),vec3(0,1,0),vec3(-s,0,c));
}
float rnd(float a) {
  vec2 p=fract(a*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float curve(float t, float e) {
  t/=e;
  return mix(
    rnd(floor(t)),
    rnd(floor(t)+1.),
    pow(S(.0,1.,fract(t)),10.)
  );
}
vec3 org() {
  float k=-.2*sin(sin(T)), drama=3.14*curve(T*.2,2.);
  vec2 m=move/R;
  vec3 ro=vec3(0,0,.1);
  ro*=rotX(m.y*6.3-k-.1+drama/12.)*rotY(m.x*6.3-.45-sin(cos(T*.2-k+drama)));
  return ro;
}
float shadow(vec3 p, vec3 lp) {
  float shd=1., maxd=length(lp-p);
  vec3 l=N(lp-p);
  for (float i=1e-3; i<maxd;) {
    float d=map(p+l*i,false);
    if (d<1e-3) {
      shd=.0;
      break;
    }
    shd=min(shd,64.*d/i);
    i+=d;
  }
  return shd;
}
float calcAO(vec3 p, vec3 n) {
  float occ=.0, sca=1.;
  for (float i=.0; i<5.; i++) {
    float
    h=.01+i*.09,
    d=map(p+h*n,false);
    occ+=(h-d)*sca;
    sca*=.55;
    if (occ>.35) break;
  }
  return clamp(1.-3.*occ,.0,1.)*(.5+.5*n.y);
}
vec3 render(vec2 uv) {
  vec3 col=vec3(0),
  p=org(), ro=p,
  rd=dir(uv,p,vec3(0),1.);
  float dd, at;
  if (march(p,rd,dd,at)) {
    vec3 n=norm(p), lp=LP, l=N(lp-p),
    e=N(ro-p), r=reflect(-l,n);
    float ld=distance(lp,p), atten=1./(1.+ld*.25+ld*ld*.125),
    ao=calcAO(p,n), shd=shadow(p+n*5e-2,lp);
    col+=shd*atten*vec3(.12,.04,.02)+clamp(dot(l,n),.0,1.)*atten*ao*shd;
    col+=pow(max(.0,dot(r,e)),8.)*atten*ao*shd;
    col+=clamp(dot(-rd,l),.0,1.)*ao*atten*1.2;
  }
  float k=mix(max(.2,1.-distance(LP,ro)),.25,fract(sin(dot(ro,vec3(12.9898,78.233,156.345)))*345678.)),
  f=S(1.,.0,clamp(dd/200.,.0,1.));
  vec3 tint=vec3(1.0,.6,.3);
  col+=tint*at*k;
  col+=hue(3.14*k+f*f*f)*k*k;
  col=mix(col,vec3(1,.85,.7),S(.0,50.,distance(p,ro)));
  col=tanh(col*col);
  col=sqrt(col);
  col=mix(sqrt(col)*1.2,col,clamp(S(-.1,.2,dot(uv,uv)),.0,1.));
  col+=tanh(tint*glow);
  vec2 c=FC/R;
  c*=1.-c.yx;
  float vig=c.x*c.y*25.;
  vig=pow(vig,.25);
  col*=vig;
  return col;
}`

/**
 * WebGL shader canvas — renders the "Grid Run" infinite tunnel effect.
 * Runs at half resolution for performance. Pauses when not visible (IntersectionObserver).
 * Respects reduced motion by showing a static single-frame render.
 */
export default function GridShader({ className = '' }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false })
    if (!gl) return

    // Resolution
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio)
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, VERTEX_SRC)
    gl.compileShader(vs)

    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, FRAGMENT_SRC)
    gl.compileShader(fs)

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('GridShader fragment error:', gl.getShaderInfoLog(fs))
      return
    }

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('GridShader link error:', gl.getProgramInfoLog(program))
      return
    }

    // Geometry
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    // Uniforms
    const uResolution = gl.getUniformLocation(program, 'resolution')
    const uTime = gl.getUniformLocation(program, 'time')
    const uMove = gl.getUniformLocation(program, 'move')
    const uWheel = gl.getUniformLocation(program, 'wheel')

    let mouseMove = [0, 0]
    let wheelOffset = [0, 0]
    let startTime = performance.now()

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseMove = [e.clientX - rect.left, e.clientY - rect.top]
    }

    const handleWheel = (e) => {
      wheelOffset[1] += e.deltaY * 0.5
    }

    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('wheel', handleWheel, { passive: true })

    const render = (now) => {
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform1f(uTime, (now - startTime) * 1e-3)
      gl.uniform2f(uMove, mouseMove[0] * dpr, mouseMove[1] * dpr)
      gl.uniform2f(uWheel, wheelOffset[0], wheelOffset[1])
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    // If reduced motion, render single frame and stop
    if (reduce) {
      render(startTime + 5000) // render at t=5s for an interesting frame
      return
    }

    // IntersectionObserver to pause when off-screen
    let visible = true
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { threshold: 0.1 }
    )
    observer.observe(canvas)

    const loop = (now) => {
      if (visible) render(now)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      resizeObserver.disconnect()
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('wheel', handleWheel)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
    }
  }, [reduce])

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  )
}
