import { useEffect, useRef } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/**
 * Hybrid star field: continuous drift + scroll-driven warp.
 *
 * Idle: stars float gently upward (like original particle field).
 * Scrolling: stars parallax based on depth + stretch vertically with velocity (warp).
 * Smooth blend between modes — no teleporting.
 *
 * Adapted from CodePen aleksa-rakocevic/QwEEWam with idle drift added.
 */
export default function ParticleField() {
  const containerRef = useRef(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ''

    const count = 80
    const stars = []
    const colors = ['#ffffff', '#ffffff', '#ffffff', '#ff3b3b', '#ffb703', '#00e5ff', '#a855f7', '#ff5ea8']

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const x = Math.random() * 100
      const y = Math.random() * 100

      // 30% chance to be static (distant, no parallax or drift)
      const isStatic = Math.random() < 0.3
      const speed = isStatic ? 0 : 0.2 + Math.random() * 0.6
      const size = isStatic ? 1 + Math.random() : 1 + Math.random() * 2
      const color = colors[Math.floor(Math.random() * colors.length)]

      // Drift velocity (idle floating) — upward + horizontal wander
      const vx = isStatic ? 0 : (Math.random() - 0.5) * 0.012
      const vy = isStatic ? 0 : -(Math.random() * 0.02 + 0.008)

      el.style.position = 'absolute'
      el.style.left = x + '%'
      el.style.top = y + '%'
      el.style.width = size + 'px'
      el.style.height = size + 'px'
      el.style.background = color
      el.style.borderRadius = '50%'
      el.style.opacity = '0.8'
      el.style.willChange = 'transform, opacity'

      // Twinkle animation — skip for reduced motion
      if (!reduce) {
        const duration = 2 + Math.random() * 4
        const delay = Math.random() * 5
        el.style.animation = `starTwinkle ${duration}s ${delay}s infinite ease-in-out`
      }

      // Glow for colored stars
      if (color !== '#ffffff') {
        el.style.boxShadow = `0 0 4px ${color}, 0 0 8px ${color}`
      }

      container.appendChild(el)
      stars.push({
        el, x, y, speed, vx, vy, isStatic,
        // Track rendered position for smooth blending
        renderedX: x,
        renderedY: y,
        // Scroll-parallax position
        scrollY: y,
      })
    }

    if (reduce) return // Static positions only

    // Scroll state
    let lastScroll = window.scrollY
    let scrollVelocity = 0
    let isScrolling = false
    let scrollTimeout = null
    // Blend factor: 0 = full idle drift, 1 = full scroll parallax
    let blend = 0
    // Current stretch (smoothly eased)
    let currentStretch = 1

    const onScroll = () => {
      const currentScroll = window.scrollY
      scrollVelocity = currentScroll - lastScroll
      lastScroll = currentScroll
      isScrolling = true

      // Compute scroll-parallax positions for all stars
      for (const star of stars) {
        if (star.isStatic) continue
        let pos = (star.y - currentScroll * star.speed * 0.05) % 100
        if (pos < 0) pos += 100
        star.scrollY = pos
      }

      // Reset scrolling flag after 150ms of no scroll
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 150)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // Animation loop — smooth blending between modes
    let raf
    const tick = () => {
      // Smoothly ramp blend toward target (0.08 = ~5 frames to settle)
      const targetBlend = isScrolling ? 1 : 0
      blend += (targetBlend - blend) * 0.08

      // Smoothly ease stretch
      const targetStretch = isScrolling
        ? Math.max(1, Math.min(1 + Math.abs(scrollVelocity) * 0.15, 4))
        : 1
      currentStretch += (targetStretch - currentStretch) * 0.1

      // Decay scroll velocity when not scrolling
      if (!isScrolling) {
        scrollVelocity *= 0.9
      }

      for (const star of stars) {
        if (star.isStatic) {
          star.el.style.transform = 'scaleY(1)'
          continue
        }

        // Drift position (always updating)
        star.x += star.vx
        star.y += star.vy

        // Wrap around
        if (star.y < -2) { star.y = 102; star.x = Math.random() * 100 }
        if (star.y > 102) { star.y = -2; star.x = Math.random() * 100 }
        if (star.x < -2) star.x = 102
        if (star.x > 102) star.x = -2

        // Blend between drift position and scroll-parallax position
        const finalX = star.x + (star.renderedX - star.x) * blend * 0 // X stays drift-based
        const finalY = star.y * (1 - blend) + star.scrollY * blend

        // Update rendered position (used as anchor when transitioning)
        star.renderedX = finalX
        star.renderedY = finalY

        // Sync drift Y to blended position so there's no jump when blend → 0
        // This gradually pulls star.y toward wherever it currently appears
        star.y += (finalY - star.y) * 0.02

        star.el.style.left = star.x + '%'
        star.el.style.top = finalY + '%'
        star.el.style.transform = `scaleY(${currentStretch.toFixed(2)})`
      }

      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', onScroll)
      container.innerHTML = ''
    }
  }, [reduce])

  return (
    <>
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
      <div
        ref={containerRef}
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{ overflow: 'hidden' }}
      />
    </>
  )
}
