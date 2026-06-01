import { useEffect, useRef } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/**
 * Floating particle field.
 *
 * Default: continuous canvas animation with rAF loop.
 * `prefers-reduced-motion: reduce`: paints a single static frame instead
 * of animating, so the visual texture remains but no motion is produced.
 * Reactive: re-renders if the user toggles their OS preference at runtime.
 */
export default function ParticleField() {
  const ref = useRef(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const colors = ['#ff3b3b', '#ffb703', '#00e5ff', '#9b5de5', '#ff5ea8']
    const N = Math.min(90, Math.floor((w * h) / 22000))
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.4 - 0.05,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * 0.5 + 0.2,
    }))

    const drawFrame = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        ctx.beginPath()
        ctx.fillStyle = p.c
        ctx.globalAlpha = p.a
        ctx.shadowBlur = 12
        ctx.shadowColor = p.c
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      if (reduce) drawFrame()
    }
    window.addEventListener('resize', onResize)

    let raf
    if (reduce) {
      drawFrame()
    } else {
      const tick = () => {
        ctx.clearRect(0, 0, w, h)
        for (const p of ps) {
          p.x += p.vx
          p.y += p.vy
          if (p.y < -10) {
            p.y = h + 10
            p.x = Math.random() * w
          }
          if (p.x < -10) p.x = w + 10
          if (p.x > w + 10) p.x = -10
          ctx.beginPath()
          ctx.fillStyle = p.c
          ctx.globalAlpha = p.a
          ctx.shadowBlur = 12
          ctx.shadowColor = p.c
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        raf = requestAnimationFrame(tick)
      }
      tick()
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [reduce])

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
      aria-hidden="true"
    />
  )
}
