import { useEffect, useRef, useCallback } from 'react'
import useTheme from '../hooks/useTheme.js'

/**
 * DriftLoader — Canvas-based loading screen with anime cursor icons.
 * Icons flow along tan-wave paths (adapted from neiltron/EyadLp).
 * Near completion, icons grow exponentially until they fill the screen,
 * creating a circle-wipe transition (inspired by trhino/jOQJPQ).
 * Calls `onDone()` once the fill is complete.
 */

// ── Canvas draw functions for each anime icon ──────────────────────────
// Each draws centered at (0,0) within a ±12 unit viewBox, scaled by caller.

const ICON_DEFS = [
  {
    id: 'embers',
    color: '#ff3b3b',
    draw(ctx, color) {
      // Flame
      ctx.beginPath()
      ctx.moveTo(0, -9)
      ctx.bezierCurveTo(5, -4, 7, 0, 5, 5)
      ctx.bezierCurveTo(4, 7, 1, 8, 0, 8)
      ctx.bezierCurveTo(-1, 8, -4, 7, -5, 5)
      ctx.bezierCurveTo(-7, 0, -5, -4, 0, -9)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.globalAlpha = 0.95
      ctx.fill()
      // Inner bright core
      ctx.beginPath()
      ctx.moveTo(0, -2)
      ctx.bezierCurveTo(2, 0, 3, 3, 1, 6)
      ctx.bezierCurveTo(0, 7, -1, 7, -2, 6)
      ctx.bezierCurveTo(-3, 4, -3, 1, 0, -2)
      ctx.closePath()
      ctx.fillStyle = '#ffe066'
      ctx.globalAlpha = 0.9
      ctx.fill()
    },
  },
  {
    id: 'leaf',
    color: '#ffb703',
    draw(ctx, color) {
      // Leaf shape
      ctx.beginPath()
      ctx.moveTo(-8, 6)
      ctx.bezierCurveTo(-8, -4, 0, -8, 8, -6)
      ctx.bezierCurveTo(6, 2, 0, 8, -8, 6)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.globalAlpha = 0.9
      ctx.fill()
      // Vein
      ctx.beginPath()
      ctx.moveTo(-7, 5)
      ctx.bezierCurveTo(-3, 0, 2, -3, 7, -5)
      ctx.strokeStyle = '#0b0418'
      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ctx.globalAlpha = 1
      ctx.stroke()
    },
  },
  {
    id: 'cursed',
    color: '#a855f7',
    draw(ctx, color) {
      // Outer hexagon
      const pts = [[0, -9], [8, -4], [8, 4], [0, 9], [-8, 4], [-8, -4]]
      ctx.beginPath()
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]))
      ctx.closePath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.6
      ctx.globalAlpha = 1
      ctx.stroke()
      // Inner hexagon
      const inner = [[0, -5], [4, -2], [4, 2], [0, 5], [-4, 2], [-4, -2]]
      ctx.beginPath()
      inner.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]))
      ctx.closePath()
      ctx.fillStyle = color
      ctx.globalAlpha = 0.5
      ctx.fill()
      // Cross lines
      ctx.beginPath()
      ctx.moveTo(-8, -4); ctx.lineTo(8, 4)
      ctx.moveTo(8, -4); ctx.lineTo(-8, 4)
      ctx.strokeStyle = color
      ctx.lineWidth = 0.8
      ctx.globalAlpha = 0.7
      ctx.stroke()
    },
  },
  {
    id: 'comic',
    color: '#22d3ee',
    draw(ctx, color) {
      // Star burst
      const pts = [[0, -9], [2.5, -3], [9, -3], [4, 1], [6, 8], [0, 4], [-6, 8], [-4, 1], [-9, -3], [-2.5, -3]]
      ctx.beginPath()
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]))
      ctx.closePath()
      ctx.fillStyle = color
      ctx.globalAlpha = 1
      ctx.fill()
      // Inner star (white)
      const inner = [[0, -5], [1.4, -1.5], [5, -1.5], [2.2, 0.5], [3.3, 4.5], [0, 2], [-3.3, 4.5], [-2.2, 0.5], [-5, -1.5], [-1.4, -1.5]]
      ctx.beginPath()
      inner.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]))
      ctx.closePath()
      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = 0.85
      ctx.fill()
    },
  },
  {
    id: 'walls',
    color: '#c0392b',
    draw(ctx, color) {
      // Left wing
      ctx.beginPath()
      ctx.moveTo(-1, 0)
      ctx.bezierCurveTo(-3, -2, -6, -3, -10, -1)
      ctx.bezierCurveTo(-7, 0, -5, 1, -1, 1)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.globalAlpha = 0.95
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-1, 1)
      ctx.bezierCurveTo(-4, 2, -7, 3, -10, 2)
      ctx.bezierCurveTo(-7, 4, -4, 5, -1, 3)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.globalAlpha = 0.7
      ctx.fill()
      // Right wing (white)
      ctx.beginPath()
      ctx.moveTo(1, 0)
      ctx.bezierCurveTo(3, -2, 6, -3, 10, -1)
      ctx.bezierCurveTo(7, 0, 5, 1, 1, 1)
      ctx.closePath()
      ctx.fillStyle = '#f5f5f5'
      ctx.globalAlpha = 0.95
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(1, 1)
      ctx.bezierCurveTo(4, 2, 7, 3, 10, 2)
      ctx.bezierCurveTo(7, 4, 4, 5, 1, 3)
      ctx.closePath()
      ctx.fillStyle = '#f5f5f5'
      ctx.globalAlpha = 0.7
      ctx.fill()
      // Spine
      ctx.beginPath()
      ctx.moveTo(0, -3); ctx.lineTo(0, 5)
      ctx.strokeStyle = color
      ctx.lineWidth = 1.4
      ctx.globalAlpha = 1
      ctx.stroke()
    },
  },
  {
    id: 'voyage',
    color: '#fbbf24',
    draw(ctx, color) {
      // Brim
      ctx.beginPath()
      ctx.ellipse(0, 3, 10, 3, 0, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = 1
      ctx.fill()
      // Crown
      ctx.beginPath()
      ctx.moveTo(-5, 3)
      ctx.bezierCurveTo(-5, -3, -4, -7, 0, -7)
      ctx.bezierCurveTo(4, -7, 5, -3, 5, 3)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      // Red ribbon
      ctx.fillStyle = '#ff3b3b'
      ctx.fillRect(-5, 1, 10, 2)
    },
  },
  {
    id: 'mystery',
    color: '#1e90ff',
    draw(ctx, color) {
      // Glass circle
      ctx.beginPath()
      ctx.arc(-2, -2, 6, 0, Math.PI * 2)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.globalAlpha = 1
      ctx.stroke()
      // Lens shine
      ctx.beginPath()
      ctx.moveTo(-4, -5)
      ctx.bezierCurveTo(-2, -7, 1, -6, 2, -4)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.6
      ctx.stroke()
      // Handle
      ctx.beginPath()
      ctx.moveTo(3, 3); ctx.lineTo(9, 9)
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.globalAlpha = 1
      ctx.stroke()
    },
  },
  {
    id: 'saiyan',
    color: '#f59e0b',
    draw(ctx, color) {
      // Outer sphere
      ctx.beginPath()
      ctx.arc(0, 0, 7, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = 0.85
      ctx.fill()
      // Inner core
      ctx.beginPath()
      ctx.arc(0, 0, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = 0.7
      ctx.fill()
      // Energy sparks
      ctx.strokeStyle = color
      ctx.lineWidth = 1.2
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.moveTo(0, -9); ctx.lineTo(0, -7)
      ctx.moveTo(0, 7); ctx.lineTo(0, 9)
      ctx.moveTo(-9, 0); ctx.lineTo(-7, 0)
      ctx.moveTo(7, 0); ctx.lineTo(9, 0)
      ctx.stroke()
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(-6, -6); ctx.lineTo(-5, -5)
      ctx.moveTo(5, -5); ctx.lineTo(6, -6)
      ctx.stroke()
    },
  },
  {
    id: 'alchemy',
    color: '#dc2626',
    draw(ctx, color) {
      // Outer circle
      ctx.beginPath()
      ctx.arc(0, 0, 9, 0, Math.PI * 2)
      ctx.strokeStyle = color
      ctx.lineWidth = 1.4
      ctx.globalAlpha = 1
      ctx.stroke()
      // Inner circle
      ctx.beginPath()
      ctx.arc(0, 0, 5, 0, Math.PI * 2)
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.7
      ctx.stroke()
      // Triangle
      ctx.beginPath()
      ctx.moveTo(0, -6); ctx.lineTo(5.2, 3); ctx.lineTo(-5.2, 3)
      ctx.closePath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.2
      ctx.globalAlpha = 1
      ctx.stroke()
      // Center dot
      ctx.beginPath()
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = 0.9
      ctx.fill()
    },
  },
  {
    id: 'shinigami',
    color: '#6b21a8',
    draw(ctx, color) {
      // Feather body
      ctx.beginPath()
      ctx.moveTo(-2, 9)
      ctx.lineTo(0, -8)
      ctx.bezierCurveTo(2, -6, 5, -3, 4, 2)
      ctx.bezierCurveTo(3, 5, 1, 7, -2, 9)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.globalAlpha = 0.9
      ctx.fill()
      // Spine
      ctx.beginPath()
      ctx.moveTo(0, -8); ctx.lineTo(-1, 9)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 0.6
      ctx.globalAlpha = 0.5
      ctx.stroke()
      // Tip
      ctx.beginPath()
      ctx.moveTo(-2, 9); ctx.lineTo(-1, 11); ctx.lineTo(0, 9)
      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = 0.8
      ctx.fill()
    },
  },
  {
    id: 'virtual',
    color: '#3b82f6',
    draw(ctx, color) {
      // Left blade
      ctx.beginPath()
      ctx.moveTo(-7, 7); ctx.lineTo(3, -7); ctx.lineTo(4, -5); ctx.lineTo(-5, 8)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.globalAlpha = 0.9
      ctx.fill()
      // Right blade
      ctx.beginPath()
      ctx.moveTo(7, 7); ctx.lineTo(-3, -7); ctx.lineTo(-4, -5); ctx.lineTo(5, 8)
      ctx.closePath()
      ctx.fillStyle = '#60a5fa'
      ctx.globalAlpha = 0.85
      ctx.fill()
      // Cross guard
      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = 0.7
      ctx.fillRect(-3, 4, 6, 1.5)
    },
  },
  {
    id: 'ghoul',
    color: '#ef4444',
    draw(ctx, color) {
      // Eye shape
      ctx.beginPath()
      ctx.moveTo(-9, 0)
      ctx.bezierCurveTo(-5, -6, 5, -6, 9, 0)
      ctx.bezierCurveTo(5, 6, -5, 6, -9, 0)
      ctx.closePath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 1
      ctx.stroke()
      // Iris
      ctx.beginPath()
      ctx.arc(0, 0, 4, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = 0.8
      ctx.fill()
      // Pupil
      ctx.beginPath()
      ctx.arc(0, 0, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#0f0f0f'
      ctx.globalAlpha = 1
      ctx.fill()
    },
  },
]

export default function DriftLoader({ onDone, onFillStart }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const onDoneRef = useRef(onDone)
  const onFillStartRef = useRef(onFillStart)
  onDoneRef.current = onDone
  onFillStartRef.current = onFillStart
  const theme = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme
  const stateRef = useRef({
    dots: [],
    width: 0,
    height: 0,
    mousePos: [-500, -500],
    progress: 0, // 0..1
    phase: 'drift', // drift | fill | fadeOut | done
    fillStart: 0,
    fadeStart: 0,
    startTime: 0,
  })

  const LOAD_DURATION = 2200 // ms for drift phase
  const FILL_DURATION = 600 // ms for dots-to-fill transition
  const FADE_DURATION = 700 // ms for fade-out revealing content

  const createDots = useCallback((width, height, count) => {
    const dots = []
    const now = performance.now()
    for (let i = 0; i < count; i++) {
      // Spread initial x evenly across the full width to avoid left-clustering
      const initX = (i / count) * width + (Math.random() - 0.5) * (width / count)
      // Assign a random anime icon
      const iconDef = ICON_DEFS[Math.floor(Math.random() * ICON_DEFS.length)]
      dots.push({
        x: initX,
        startTime: now,
        frequency: 0.075,
        amplitude: height * 0.5,
        icon: iconDef,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        size: 1,
        maxSize: Math.random() * 22 + 6,
        speed: 0,
        maxSpeed: (Math.random() * 0.5) / 2.5,
        opacity: 0,
      })
    }
    return dots
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const s = stateRef.current

    const resize = () => {
      s.width = window.innerWidth
      s.height = window.innerHeight
      canvas.width = s.width * window.devicePixelRatio
      canvas.height = s.height * window.devicePixelRatio
      canvas.style.width = s.width + 'px'
      canvas.style.height = s.height + 'px'
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()

    const dotCount = s.width > 640 ? 120 : 70
    s.dots = createDots(s.width, s.height, dotCount)
    s.startTime = performance.now()
    s.phase = 'drift'

    const getYPos = (dot) => {
      const xNorm = dot.x / s.width
      return (
        dot.amplitude *
          Math.tan(
            Math.PI * xNorm * dot.frequency - dot.x / 12
          ) +
        s.height / 2
      )
    }

    const nearCursor = (x, y) => {
      return (
        Math.abs(x - s.mousePos[0]) < 60 &&
        Math.abs(y - s.mousePos[1]) < 60
      )
    }

    const easeInCubic = (t) => t * t * t
    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t)

    const draw = () => {
      const now = performance.now()
      const elapsed = now - s.startTime

      // Update progress
      s.progress = Math.min(1, elapsed / LOAD_DURATION)

      // Phase transition: when progress hits 1, start fill
      if (s.phase === 'drift' && s.progress >= 1) {
        s.phase = 'fill'
        s.fillStart = now
        if (onFillStartRef.current) onFillStartRef.current()
      }

      // Fill phase complete → start fade out
      if (s.phase === 'fill') {
        const fillElapsed = now - s.fillStart
        const fillT = Math.min(1, fillElapsed / FILL_DURATION)
        if (fillT >= 1) {
          s.phase = 'fadeOut'
          s.fadeStart = now
        }
      }

      // Fade out phase — canvas becomes transparent revealing content
      if (s.phase === 'fadeOut') {
        const fadeElapsed = now - s.fadeStart
        const fadeT = Math.min(1, fadeElapsed / FADE_DURATION)
        const easeOut = 1 - (1 - fadeT) * (1 - fadeT) * (1 - fadeT)
        canvas.style.opacity = 1 - easeOut
        if (fadeT >= 1) {
          s.phase = 'done'
          onDoneRef.current()
          return
        }
        const bgFade = themeRef.current === 'light' ? '#f5f0eb' : '#111'
        ctx.clearRect(0, 0, s.width, s.height)
        ctx.fillStyle = bgFade
        ctx.fillRect(0, 0, s.width, s.height)
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, s.width, s.height)

      // Background — theme-aware
      const bgColor = themeRef.current === 'light' ? '#f5f0eb' : '#111'
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, s.width, s.height)

      // Fill phase: icons grow to fill screen
      const fillT =
        s.phase === 'fill'
          ? Math.min(1, (now - s.fillStart) / FILL_DURATION)
          : 0
      const fillMultiplier = s.phase === 'fill' ? 1 + easeInCubic(fillT) * 60 : 1

      // Growth factor toward end of loading (last 30%)
      const growFactor =
        s.progress > 0.7
          ? 1 + easeOutQuad((s.progress - 0.7) / 0.3) * 2
          : 1

      // Speed acceleration: icons move faster as loading nears end
      const speedBoost = s.progress > 0.5
        ? 1 + easeOutQuad((s.progress - 0.5) / 0.5) * 4
        : 1

      // Draw icons
      for (let i = 0; i < s.dots.length; i++) {
        const dot = s.dots[i]
        const y = getYPos(dot)
        const posX = ((dot.x % s.width) + s.width) % s.width

        // Wrap around — reset when past screen
        if (dot.x >= s.width * 1.1) {
          dot.x = -(Math.random() * 50 + 10)
        }

        // Speed/opacity/size ramp-up
        if (dot.speed < dot.maxSpeed) dot.speed += 0.008
        if (dot.opacity < 1) dot.opacity += 0.015

        // Size logic — near cursor grows, else eases to 1/3 maxSize
        const dotAge = now - dot.startTime
        if (nearCursor(posX, y) && dot.size < dot.maxSize) {
          dot.size += 1.2
        } else if (dot.size < dot.maxSize / 3) {
          const sizeT = Math.min(1, (dotAge - 600) / 1600)
          dot.size = (dot.maxSize / 3) * (sizeT > 0 ? easeOutQuad(sizeT) : 0) + 1
        } else if (dot.size > dot.maxSize / 3 + 1) {
          dot.size -= 0.4
        }

        dot.x += dot.speed * speedBoost
        dot.rotation += dot.rotSpeed

        // Apply growth and fill multipliers
        const renderSize = dot.size * growFactor * fillMultiplier
        const renderOpacity = Math.min(1, dot.opacity * (s.phase === 'fill' ? 1 + fillT * 2 : 1))

        // Scale factor: icons are drawn in a ±12 unit space, so scale = renderSize / 12
        const scale = renderSize / 12

        ctx.save()
        ctx.translate(posX, y)
        ctx.rotate(dot.rotation)
        ctx.scale(scale, scale)
        ctx.globalAlpha = renderOpacity
        dot.icon.draw(ctx, dot.icon.color)
        ctx.restore()
      }

      // Center text — "起動中" + progress
      if (s.phase === 'drift') {
        const textOpacity = Math.min(1, elapsed / 800)
        const isLight = themeRef.current === 'light'
        ctx.globalAlpha = 1
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Japanese text
        ctx.font = '14px "x8y12pxDenkiChip", sans-serif'
        ctx.fillStyle = isLight
          ? `rgba(200, 120, 0, ${textOpacity * 0.9})`
          : `rgba(255, 194, 60, ${textOpacity * 0.9})`
        ctx.fillText('起動中', s.width / 2, s.height / 2 - 28)

        // Percentage
        ctx.font = '12px "JetBrains Mono", monospace'
        ctx.fillStyle = isLight
          ? `rgba(60, 50, 40, ${textOpacity * 0.6})`
          : `rgba(255, 255, 255, ${textOpacity * 0.6})`
        const pct = Math.floor(s.progress * 100).toString().padStart(3, '0')
        ctx.fillText(`${pct}%`, s.width / 2, s.height / 2 + 28)

        // "LOADING" — large outlined text
        ctx.font = '900 64px Bangers, cursive'
        ctx.strokeStyle = `rgba(255, 45, 85, ${textOpacity * 0.8})`
        ctx.lineWidth = 1.5
        ctx.strokeText('LOADING', s.width / 2, s.height / 2 + 2)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    // Mouse interaction
    const onMove = (e) => {
      const x = e.touches ? e.touches[0].pageX : e.pageX
      const y = e.touches ? e.touches[0].pageY : e.pageY
      s.mousePos = [x, y]
    }
    const onLeave = () => { s.mousePos = [-500, -500] }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onLeave)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [createDots])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[10001]"
      style={{ background: theme === 'light' ? '#f5f0eb' : '#111' }}
    />
  )
}
