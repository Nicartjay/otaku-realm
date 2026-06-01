import { useRef, useEffect, useCallback } from 'react'

/**
 * Canvas-based particle effects for anime cards, inspired by the
 * Animated Weather Cards CodePen (ste-vg/GqaZbo).
 *
 * Each anime gets a unique particle system that activates on hover.
 * Particles can overflow the card boundary for dramatic effect.
 */

/* ─── Particle factories per theme ──────────────────────────────── */

function createEmbers(w, h) {
  // Demon Slayer: rising fire embers
  return Array.from({ length: 35 }, () => ({
    x: Math.random() * w,
    y: h + Math.random() * 20,
    vx: (Math.random() - 0.5) * 1.5,
    vy: -(1.5 + Math.random() * 3),
    r: 1 + Math.random() * 3,
    life: Math.random(),
    decay: 0.003 + Math.random() * 0.005,
    color: Math.random() > 0.5 ? '#ff3b3b' : '#ffb703',
  }))
}

function drawEmbers(ctx, particles, w, h) {
  particles.forEach((p) => {
    p.x += p.vx + Math.sin(p.life * 6) * 0.5
    p.y += p.vy
    p.life -= p.decay
    if (p.life <= 0 || p.y < -20) {
      p.x = Math.random() * w
      p.y = h + 10
      p.life = 1
    }
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = p.life * 0.9
    ctx.shadowColor = p.color
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.shadowBlur = 0
  })
}

function createLeaves(w, h) {
  // Naruto: swirling leaves
  return Array.from({ length: 20 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: 0.5 + Math.random() * 1.5,
    vy: 0.3 + Math.random() * 1,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.1,
    size: 4 + Math.random() * 6,
    phase: Math.random() * Math.PI * 2,
    color: Math.random() > 0.4 ? '#22c55e' : '#86efac',
  }))
}

function drawLeaves(ctx, particles, w, h, time) {
  particles.forEach((p) => {
    p.x += p.vx + Math.sin(time * 0.002 + p.phase) * 1.2
    p.y += p.vy + Math.cos(time * 0.003 + p.phase) * 0.5
    p.rot += p.rotSpeed
    if (p.x > w + 20) p.x = -20
    if (p.y > h + 20) p.y = -20
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.globalAlpha = 0.8
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2)
    ctx.fill()
    // leaf vein
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(-p.size, 0)
    ctx.lineTo(p.size, 0)
    ctx.stroke()
    ctx.restore()
  })
}

function createCursed(w, h) {
  // Jujutsu Kaisen: dark cursed energy particles
  return Array.from({ length: 30 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    r: 2 + Math.random() * 5,
    pulse: Math.random() * Math.PI * 2,
    color: Math.random() > 0.5 ? '#7c3aed' : '#a855f7',
  }))
}

function drawCursed(ctx, particles, w, h, time) {
  particles.forEach((p) => {
    p.x += p.vx + Math.sin(time * 0.003 + p.pulse) * 1
    p.y += p.vy + Math.cos(time * 0.002 + p.pulse) * 1
    if (p.x < -20 || p.x > w + 20) p.vx *= -1
    if (p.y < -20 || p.y > h + 20) p.vy *= -1
    const scale = 0.7 + Math.sin(time * 0.005 + p.pulse) * 0.3
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * scale, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = 0.6 + Math.sin(time * 0.004 + p.pulse) * 0.3
    ctx.shadowColor = p.color
    ctx.shadowBlur = 15
    ctx.fill()
    ctx.shadowBlur = 0
  })
}

function createComic(w, h) {
  // My Hero Academia: energy sparks/lightning
  return Array.from({ length: 25 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    life: Math.random(),
    decay: 0.01 + Math.random() * 0.02,
    size: 2 + Math.random() * 3,
    color: Math.random() > 0.5 ? '#facc15' : '#22d3ee',
  }))
}

function drawComic(ctx, particles, w, h) {
  particles.forEach((p) => {
    p.x += p.vx
    p.y += p.vy
    p.life -= p.decay
    if (p.life <= 0) {
      p.x = Math.random() * w
      p.y = Math.random() * h
      p.vx = (Math.random() - 0.5) * 4
      p.vy = (Math.random() - 0.5) * 4
      p.life = 1
    }
    // Draw as small lightning bolt shape
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.globalAlpha = p.life
    ctx.strokeStyle = p.color
    ctx.lineWidth = 1.5
    ctx.shadowColor = p.color
    ctx.shadowBlur = 6
    ctx.beginPath()
    ctx.moveTo(0, -p.size)
    ctx.lineTo(p.size * 0.3, 0)
    ctx.lineTo(-p.size * 0.2, 0)
    ctx.lineTo(0, p.size)
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.restore()
  })
}

function createWalls(w, h) {
  // Attack on Titan: falling debris/rocks
  return Array.from({ length: 20 }, () => ({
    x: Math.random() * w,
    y: -10 - Math.random() * 30,
    vx: (Math.random() - 0.5) * 1,
    vy: 2 + Math.random() * 3,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.15,
    size: 3 + Math.random() * 6,
    color: Math.random() > 0.5 ? '#78716c' : '#a8a29e',
  }))
}

function drawWalls(ctx, particles, w, h) {
  particles.forEach((p) => {
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.05 // gravity
    p.rot += p.rotSpeed
    if (p.y > h + 20) {
      p.y = -10
      p.x = Math.random() * w
      p.vy = 2 + Math.random() * 3
    }
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.globalAlpha = 0.8
    ctx.fillStyle = p.color
    // Irregular rock shape
    ctx.beginPath()
    ctx.moveTo(-p.size, -p.size * 0.5)
    ctx.lineTo(p.size * 0.3, -p.size)
    ctx.lineTo(p.size, p.size * 0.3)
    ctx.lineTo(0, p.size)
    ctx.lineTo(-p.size * 0.7, p.size * 0.5)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  })
}

function createVoyage(w, h) {
  // One Piece: rising bubbles/sparkles
  return Array.from({ length: 25 }, () => ({
    x: Math.random() * w,
    y: h + Math.random() * 20,
    vy: -(0.8 + Math.random() * 2),
    r: 2 + Math.random() * 5,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.02 + Math.random() * 0.03,
    color: Math.random() > 0.5 ? '#38bdf8' : '#67e8f9',
  }))
}

function drawVoyage(ctx, particles, w, h, time) {
  particles.forEach((p) => {
    p.wobble += p.wobbleSpeed
    p.x += Math.sin(p.wobble) * 1.2
    p.y += p.vy
    if (p.y < -20) {
      p.y = h + 10
      p.x = Math.random() * w
    }
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.strokeStyle = p.color
    ctx.globalAlpha = 0.6
    ctx.lineWidth = 1
    ctx.stroke()
    // highlight
    ctx.beginPath()
    ctx.arc(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.globalAlpha = 0.4
    ctx.fill()
  })
}

function createMystery(w, h) {
  // Detective Conan: floating light specks/dust motes
  return Array.from({ length: 30 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -(0.2 + Math.random() * 0.5),
    r: 1 + Math.random() * 2.5,
    phase: Math.random() * Math.PI * 2,
    color: Math.random() > 0.5 ? '#fbbf24' : '#f59e0b',
  }))
}

function drawMystery(ctx, particles, w, h, time) {
  particles.forEach((p) => {
    p.x += p.vx + Math.sin(time * 0.001 + p.phase) * 0.3
    p.y += p.vy
    if (p.y < -10) {
      p.y = h + 10
      p.x = Math.random() * w
    }
    const flicker = 0.5 + Math.sin(time * 0.006 + p.phase) * 0.4
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = flicker
    ctx.shadowColor = p.color
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.shadowBlur = 0
  })
}

function createSaiyan(w, h) {
  // Dragon Ball Z: ki energy orbs rising
  return Array.from({ length: 30 }, () => ({
    x: Math.random() * w,
    y: h + Math.random() * 20,
    vy: -(2 + Math.random() * 3),
    vx: (Math.random() - 0.5) * 1.5,
    r: 1.5 + Math.random() * 4,
    life: Math.random(),
    decay: 0.004 + Math.random() * 0.006,
    color: Math.random() > 0.4 ? '#facc15' : '#fb923c',
  }))
}

function drawSaiyan(ctx, particles, w, h) {
  particles.forEach((p) => {
    p.x += p.vx
    p.y += p.vy
    p.life -= p.decay
    if (p.life <= 0 || p.y < -30) {
      p.x = Math.random() * w
      p.y = h + 10
      p.life = 1
      p.vy = -(2 + Math.random() * 3)
    }
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = p.life * 0.85
    ctx.shadowColor = p.color
    ctx.shadowBlur = 12
    ctx.fill()
    ctx.shadowBlur = 0
  })
}

function createAlchemy(w, h) {
  // FMA: glowing transmutation sparks in circular motion + lightning bolts
  const orbs = Array.from({ length: 24 }, (_, i) => ({
    type: 'orb',
    angle: (i / 24) * Math.PI * 2,
    radius: 40 + Math.random() * 30,
    speed: 0.01 + Math.random() * 0.015,
    r: 1.5 + Math.random() * 2.5,
    cx: w / 2,
    cy: h / 2,
    color: Math.random() > 0.5 ? '#38bdf8' : '#60a5fa',
  }))
  const bolts = Array.from({ length: 5 }, () => ({
    type: 'bolt',
    x: Math.random() * w,
    y: Math.random() * h * 0.3,
    life: 0,
    maxLife: 8 + Math.floor(Math.random() * 6),
    cooldown: 40 + Math.floor(Math.random() * 80),
    segments: [],
  }))
  return [...orbs, ...bolts]
}

function _generateBoltSegments(x, y, h) {
  const segs = []
  let cx = x
  let cy = y
  const endY = cy + 40 + Math.random() * (h * 0.5)
  while (cy < endY) {
    const nx = cx + (Math.random() - 0.5) * 30
    const ny = cy + 10 + Math.random() * 20
    segs.push({ x1: cx, y1: cy, x2: nx, y2: ny })
    cx = nx
    cy = ny
    // chance of branch
    if (Math.random() > 0.7) {
      const bx = cx + (Math.random() - 0.5) * 40
      const by = cy + 10 + Math.random() * 15
      segs.push({ x1: cx, y1: cy, x2: bx, y2: by, branch: true })
    }
  }
  return segs
}

function drawAlchemy(ctx, particles, w, h, time) {
  // Draw circle outline
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2)
  ctx.strokeStyle = '#38bdf8'
  ctx.globalAlpha = 0.2
  ctx.lineWidth = 1
  ctx.stroke()

  // Inner pentagon
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2 + time * 0.001
    const x = w / 2 + Math.cos(a) * 40
    const y = h / 2 + Math.sin(a) * 40
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.strokeStyle = '#60a5fa'
  ctx.globalAlpha = 0.15
  ctx.stroke()

  particles.forEach((p) => {
    if (p.type === 'orb') {
      p.angle += p.speed
      p.cx = w / 2
      p.cy = h / 2
      const x = p.cx + Math.cos(p.angle) * p.radius
      const y = p.cy + Math.sin(p.angle) * p.radius
      ctx.beginPath()
      ctx.arc(x, y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.globalAlpha = 0.7
      ctx.shadowColor = p.color
      ctx.shadowBlur = 8
      ctx.fill()
      ctx.shadowBlur = 0
    } else if (p.type === 'bolt') {
      // Lightning bolt logic
      if (p.life > 0) {
        p.life--
        const alpha = p.life / p.maxLife
        p.segments.forEach((seg) => {
          ctx.beginPath()
          ctx.moveTo(seg.x1, seg.y1)
          ctx.lineTo(seg.x2, seg.y2)
          ctx.strokeStyle = seg.branch ? '#93c5fd' : '#e0f2fe'
          ctx.globalAlpha = alpha * (seg.branch ? 0.5 : 0.9)
          ctx.lineWidth = seg.branch ? 1 : 2
          ctx.shadowColor = '#38bdf8'
          ctx.shadowBlur = seg.branch ? 4 : 12
          ctx.stroke()
          ctx.shadowBlur = 0
        })
      } else {
        p.cooldown--
        if (p.cooldown <= 0) {
          p.x = Math.random() * w
          p.y = Math.random() * h * 0.2
          p.segments = _generateBoltSegments(p.x, p.y, h)
          p.life = p.maxLife
          p.cooldown = 40 + Math.floor(Math.random() * 80)
        }
      }
    }
  })
}

function createShinigami(w, h) {
  // Death Note: falling dark feathers/wisps
  return Array.from({ length: 18 }, () => ({
    x: Math.random() * w,
    y: -10 - Math.random() * 40,
    vx: (Math.random() - 0.5) * 0.8,
    vy: 0.8 + Math.random() * 1.5,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    size: 5 + Math.random() * 8,
    phase: Math.random() * Math.PI * 2,
    color: Math.random() > 0.6 ? '#6b21a8' : '#1e1b4b',
  }))
}

function drawShinigami(ctx, particles, w, h, time) {
  particles.forEach((p) => {
    p.x += p.vx + Math.sin(time * 0.001 + p.phase) * 0.5
    p.y += p.vy
    p.rot += p.rotSpeed
    if (p.y > h + 20) {
      p.y = -10
      p.x = Math.random() * w
    }
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.globalAlpha = 0.7
    ctx.fillStyle = p.color
    // Feather shape
    ctx.beginPath()
    ctx.moveTo(0, -p.size)
    ctx.quadraticCurveTo(p.size * 0.6, -p.size * 0.3, p.size * 0.2, p.size * 0.5)
    ctx.quadraticCurveTo(0, p.size * 0.3, -p.size * 0.2, p.size * 0.5)
    ctx.quadraticCurveTo(-p.size * 0.6, -p.size * 0.3, 0, -p.size)
    ctx.fill()
    ctx.restore()
  })
}

function createVirtual(w, h) {
  // SAO: digital pixels/glitch fragments
  return Array.from({ length: 35 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 2,
    vy: -(1 + Math.random() * 2),
    size: 2 + Math.random() * 5,
    life: Math.random(),
    decay: 0.005 + Math.random() * 0.01,
    color: Math.random() > 0.5 ? '#22d3ee' : '#06b6d4',
  }))
}

function drawVirtual(ctx, particles, w, h) {
  particles.forEach((p) => {
    p.x += p.vx
    p.y += p.vy
    p.life -= p.decay
    if (p.life <= 0) {
      p.x = Math.random() * w
      p.y = h + 10
      p.life = 1
    }
    ctx.globalAlpha = p.life * 0.8
    ctx.fillStyle = p.color
    ctx.shadowColor = p.color
    ctx.shadowBlur = 4
    // Pixel square
    ctx.fillRect(p.x, p.y, p.size, p.size * 0.4)
    ctx.shadowBlur = 0
  })
}

function createGhoul(w, h) {
  // Tokyo Ghoul: red kagune tendrils/particles
  return Array.from({ length: 28 }, () => ({
    x: Math.random() * w,
    y: h * 0.8 + Math.random() * h * 0.2,
    vx: (Math.random() - 0.5) * 1.5,
    vy: -(1.5 + Math.random() * 2.5),
    r: 1.5 + Math.random() * 3,
    life: Math.random(),
    decay: 0.004 + Math.random() * 0.008,
    wiggle: Math.random() * Math.PI * 2,
    color: Math.random() > 0.4 ? '#ef4444' : '#991b1b',
  }))
}

function drawGhoul(ctx, particles, w, h, time) {
  particles.forEach((p) => {
    p.wiggle += 0.05
    p.x += p.vx + Math.sin(p.wiggle) * 1.5
    p.y += p.vy
    p.life -= p.decay
    if (p.life <= 0 || p.y < -20) {
      p.x = Math.random() * w
      p.y = h * 0.8 + Math.random() * h * 0.2
      p.life = 1
      p.vy = -(1.5 + Math.random() * 2.5)
    }
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = p.life * 0.85
    ctx.shadowColor = '#ef4444'
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.shadowBlur = 0
  })
}

/* ─── Theme → factory/draw map ──────────────────────────────────── */

const EFFECTS = {
  embers: { create: createEmbers, draw: drawEmbers },
  leaf: { create: createLeaves, draw: drawLeaves },
  cursed: { create: createCursed, draw: drawCursed },
  comic: { create: createComic, draw: drawComic },
  walls: { create: createWalls, draw: drawWalls },
  voyage: { create: createVoyage, draw: drawVoyage },
  mystery: { create: createMystery, draw: drawMystery },
  saiyan: { create: createSaiyan, draw: drawSaiyan },
  alchemy: { create: createAlchemy, draw: drawAlchemy },
  shinigami: { create: createShinigami, draw: drawShinigami },
  virtual: { create: createVirtual, draw: drawVirtual },
  ghoul: { create: createGhoul, draw: drawGhoul },
}

/* ─── Component ─────────────────────────────────────────────────── */

export default function AnimeCardEffects({ themeId, isHovered }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef(null)
  const startTimeRef = useRef(null)

  const effect = EFFECTS[themeId]

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !effect) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const time = Date.now() - (startTimeRef.current || Date.now())

    ctx.clearRect(0, 0, w, h)
    ctx.globalAlpha = 1

    if (particlesRef.current) {
      effect.draw(ctx, particlesRef.current, w, h, time)
    }

    ctx.globalAlpha = 1
    animRef.current = requestAnimationFrame(animate)
  }, [effect])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !effect) return

    if (isHovered) {
      // Size canvas larger than parent to allow particles to overflow
      const parent = canvas.parentElement
      const rect = parent.getBoundingClientRect()
      const overflow = 60 // px of overflow on each side
      canvas.width = rect.width + overflow * 2
      canvas.height = rect.height + overflow * 2

      startTimeRef.current = Date.now()
      particlesRef.current = effect.create(canvas.width, canvas.height)
      animate()
    } else {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
        animRef.current = null
      }
      // Clear canvas
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current = null
    }

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
        animRef.current = null
      }
    }
  }, [isHovered, effect, animate])

  if (!effect) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute z-20"
      style={{
        top: '-60px',
        left: '-60px',
        right: '-60px',
        bottom: '-60px',
        width: 'calc(100% + 120px)',
        height: 'calc(100% + 120px)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    />
  )
}
