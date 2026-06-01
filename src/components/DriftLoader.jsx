import { useEffect, useRef, useCallback } from 'react'
import useTheme from '../hooks/useTheme.js'

/**
 * DriftLoader — Canvas-based dot drift loading screen.
 * Dots flow along tan-wave paths (adapted from neiltron/EyadLp).
 * Near completion, dots grow exponentially until they fill the screen,
 * creating a circle-wipe transition (inspired by trhino/jOQJPQ).
 * Calls `onDone()` once the fill is complete.
 */
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
    const isLight = themeRef.current === 'light'
    for (let i = 0; i < count; i++) {
      // Spread initial x evenly across the full width to avoid left-clustering
      const initX = (i / count) * width + (Math.random() - 0.5) * (width / count)
      dots.push({
        x: initX,
        startTime: now,
        frequency: 0.075,
        amplitude: height * 0.5,
        // ~25% gold/flame dots, rest neutral
        color: Math.random() < 0.25
          ? [255, 194, 60] // sun/gold
          : Math.random() < 0.3
            ? [255, 45, 85] // flame
            : isLight ? [200, 190, 175] : [30, 30, 30],
        size: 1,
        maxSize: Math.random() * 28 + 4,
        speed: 0,
        maxSpeed: (Math.random() * 0.5) / 2.5,
        section: 1, // uniform section so posX = x * 2 spreads evenly
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

    const dotCount = s.width > 640 ? 280 : 160
    s.dots = createDots(s.width, s.height, dotCount)
    s.startTime = performance.now()
    s.phase = 'drift'

    const getYPos = (dot) => {
      // Use modulo position for smooth wave across full width
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
        const easeOut = 1 - (1 - fadeT) * (1 - fadeT) * (1 - fadeT) // cubic ease-out
        canvas.style.opacity = 1 - easeOut
        if (fadeT >= 1) {
          s.phase = 'done'
          onDoneRef.current()
          return
        }
        // Keep drawing the filled state while fading
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

      // Fill phase: dots grow to fill screen
      const fillT =
        s.phase === 'fill'
          ? Math.min(1, (now - s.fillStart) / FILL_DURATION)
          : 0
      const fillMultiplier = s.phase === 'fill' ? 1 + easeInCubic(fillT) * 80 : 1

      // Growth factor toward end of loading (last 30%)
      const growFactor =
        s.progress > 0.7
          ? 1 + easeOutQuad((s.progress - 0.7) / 0.3) * 2.5
          : 1

      // Speed acceleration: dots move faster as loading nears end
      const speedBoost = s.progress > 0.5
        ? 1 + easeOutQuad((s.progress - 0.5) / 0.5) * 4
        : 1

      // Draw dots
      for (let i = 0; i < s.dots.length; i++) {
        const dot = s.dots[i]
        const y = getYPos(dot)
        // posX wraps within the screen width directly
        const posX = ((dot.x % s.width) + s.width) % s.width

        // Wrap around — reset when past screen
        if (dot.x >= s.width * 1.1) {
          dot.x = -(Math.random() * 50 + 10)
        }

        // Speed/opacity/size ramp-up
        if (dot.speed < dot.maxSpeed) dot.speed += 0.008
        if (dot.opacity < 1) dot.opacity += 0.02

        // Size logic — near cursor grows, else eases to 1/4 maxSize
        const dotAge = now - dot.startTime
        if (nearCursor(posX, y) && dot.size < dot.maxSize) {
          dot.size += 1.5
        } else if (dot.size < dot.maxSize / 4) {
          const sizeT = Math.min(1, (dotAge - 800) / 1800)
          dot.size = (dot.maxSize / 4) * (sizeT > 0 ? easeOutQuad(sizeT) : 0) + 1
        } else if (dot.size > dot.maxSize / 4 + 1) {
          dot.size -= 0.5
        }

        dot.x += dot.speed * speedBoost

        // Apply growth and fill multipliers
        const renderSize = dot.size * growFactor * fillMultiplier
        const renderOpacity = Math.min(1, dot.opacity * (s.phase === 'fill' ? 1 + fillT * 2 : 1))

        ctx.fillStyle = `rgba(${dot.color[0]},${dot.color[1]},${dot.color[2]},${renderOpacity})`
        ctx.beginPath()
        ctx.arc(posX, y, renderSize, 0, Math.PI * 2)
        ctx.fill()
      }

      // Center text — "起動中" + progress
      if (s.phase === 'drift') {
        const textOpacity = Math.min(1, elapsed / 800)
        const isLight = themeRef.current === 'light'
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
