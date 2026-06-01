import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCursorTheme } from '../context/CursorThemeContext.jsx'

/** Convert any hex color (#rgb / #rrggbb) to "r,g,b" for rgba use. */
function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return '255,255,255'
  let h = hex.trim().replace('#', '')
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  if (h.length !== 6) return '255,255,255'
  const n = parseInt(h, 16)
  if (Number.isNaN(n)) return '255,255,255'
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `${r},${g},${b}`
}

/**
 * Refined glowing magnetic cursor.
 *
 * Layers:
 *   1. Aura  — soft large radial glow
 *   2. Ring  — bordered ring with spring-lag
 *   3. Dot   — pinpoint that tracks pointer 1:1
 *   4. Trail — multi-color particles with falloff
 *   5. Ripple — click expansion
 *
 * Theme:
 *   Pulled from CursorThemeContext. Routes can swap palette via
 *   setTheme(...) on mount and resetTheme() on unmount.
 */
export default function Cursor() {
  const { theme } = useCursorTheme()

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useMotionValue(-100)
  const ringY = useMotionValue(-100)
  const auraX = useMotionValue(-100)
  const auraY = useMotionValue(-100)

  const ringSX = useSpring(ringX, { stiffness: 220, damping: 22, mass: 0.5 })
  const ringSY = useSpring(ringY, { stiffness: 220, damping: 22, mass: 0.5 })
  const auraSX = useSpring(auraX, { stiffness: 60, damping: 18, mass: 1.2 })
  const auraSY = useSpring(auraY, { stiffness: 60, damping: 18, mass: 1.2 })

  const [variant, setVariant] = useState('default') // default | hover | text | link
  const [clicking, setClicking] = useState(false)
  const [hidden, setHidden] = useState(true)

  const trailRef = useRef([])
  const [, setTrailTick] = useState(0)
  const lastSpawn = useRef(0)

  const ripplesRef = useRef([])
  const [, setRippleTick] = useState(0)

  useEffect(() => {
    const move = (e) => {
      setHidden(false)
      x.set(e.clientX)
      y.set(e.clientY)
      auraX.set(e.clientX)
      auraY.set(e.clientY)

      const el = document.elementFromPoint(e.clientX, e.clientY)
      const hoverEl = el?.closest?.('[data-cursor="hover"]')
      const textEl = el?.closest?.('[data-cursor="text"]')
      const linkEl = el?.closest?.('[data-cursor="link"]')
      const interactiveTag = el?.closest?.('a, button, input, textarea, select')

      // Ring target is ALWAYS the raw pointer so the spring settles
      // exactly on it at rest (keeps dot perfectly centered in ring).
      ringX.set(e.clientX)
      ringY.set(e.clientY)

      if (hoverEl) setVariant('hover')
      else if (textEl) setVariant('text')
      else if (linkEl || interactiveTag) setVariant('link')
      else setVariant('default')

      const now = performance.now()
      if (now - lastSpawn.current > 22) {
        lastSpawn.current = now
        trailRef.current = [
          ...trailRef.current.slice(-26),
          {
            id: now + Math.random(),
            x: e.clientX,
            y: e.clientY,
            life: now,
            hue: Math.floor(Math.random() * 5),
          },
        ]
        setTrailTick((t) => t + 1)
      }
    }
    const down = (e) => {
      setClicking(true)
      ripplesRef.current = [
        ...ripplesRef.current,
        { id: performance.now(), x: e.clientX, y: e.clientY },
      ].slice(-6)
      setRippleTick((t) => t + 1)
    }
    const up = () => setClicking(false)
    const leave = () => setHidden(true)

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('mouseleave', leave)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('mouseleave', leave)
    }
  }, [x, y, ringX, ringY, auraX, auraY])

  useEffect(() => {
    const id = setInterval(() => {
      const now = performance.now()
      const before = trailRef.current.length
      trailRef.current = trailRef.current.filter((p) => now - p.life < 700)
      if (trailRef.current.length !== before) setTrailTick((t) => t + 1)

      const beforeR = ripplesRef.current.length
      ripplesRef.current = ripplesRef.current.filter((r) => now - r.id < 800)
      if (ripplesRef.current.length !== beforeR) setRippleTick((t) => t + 1)
    }, 100)
    return () => clearInterval(id)
  }, [])

  // Derive theme-driven styles
  const ringStyle = useMemo(() => {
    if (variant === 'hover') {
      return {
        width: 64,
        height: 64,
        borderRadius: 9999,
        borderColor: theme.hover,
        boxShadow: `0 0 30px ${theme.hover}, 0 0 60px ${theme.default}`,
      }
    }
    if (variant === 'text') {
      const rgb = hexToRgb(theme.text)
      return {
        width: 6,
        height: 36,
        borderRadius: 6,
        borderColor: theme.text,
        boxShadow: `0 0 18px ${theme.text}, 0 0 40px rgba(${rgb},0.6)`,
      }
    }
    if (variant === 'link') {
      const rgb = hexToRgb(theme.link)
      return {
        width: 48,
        height: 48,
        borderRadius: 9999,
        borderColor: theme.link,
        boxShadow: `0 0 20px ${theme.link}, 0 0 50px rgba(${rgb},0.5)`,
      }
    }
    const rgb = hexToRgb(theme.default)
    return {
      width: 36,
      height: 36,
      borderRadius: 9999,
      borderColor: theme.default,
      boxShadow: `0 0 18px ${theme.default}, 0 0 40px rgba(${rgb},0.5)`,
    }
  }, [variant, theme])

  const auraBg = useMemo(() => {
    if (variant === 'hover') {
      const rgb = hexToRgb(theme.hover)
      return `radial-gradient(circle, rgba(${rgb},0.6), transparent 60%)`
    }
    if (variant === 'text' || variant === 'link') {
      const rgb = hexToRgb(theme.link)
      return `radial-gradient(circle, rgba(${rgb},0.55), transparent 60%)`
    }
    const rgb = hexToRgb(theme.default)
    return `radial-gradient(circle, rgba(${rgb},0.55), transparent 60%)`
  }, [variant, theme])

  const dotColor = useMemo(() => {
    if (variant === 'hover') return theme.dotHover
    if (variant === 'link') return theme.dotLink
    return '#ffffff'
  }, [variant, theme])

  return (
    <>
      {/* aura — large soft glow */}
      <motion.div
        style={{ x: auraSX, y: auraSY, opacity: hidden ? 0 : 0.45 }}
        className="pointer-events-none fixed left-0 top-0 z-[9997]"
      >
        <div
          style={{ marginLeft: -130, marginTop: -130, background: auraBg }}
          className="h-[260px] w-[260px] rounded-full blur-3xl mix-blend-screen"
        />
      </motion.div>

      {/* ripples on click — themed dual rings */}
      <div className="pointer-events-none fixed inset-0 z-[9998]">
        {ripplesRef.current.map((r) => (
          <motion.span
            key={r.id}
            initial={{ opacity: 0.7, scale: 0.4 }}
            animate={{ opacity: 0, scale: 4 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              left: r.x,
              top: r.y,
              borderColor: theme.ripple?.[0] || theme.default,
            }}
            className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 mix-blend-screen"
          />
        ))}
        {ripplesRef.current.map((r) => (
          <motion.span
            key={`s${r.id}`}
            initial={{ opacity: 0.9, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              left: r.x,
              top: r.y,
              borderColor: theme.ripple?.[1] || theme.hover,
            }}
            className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 mix-blend-screen"
          />
        ))}
      </div>

      {/* trail */}
      <div className="pointer-events-none fixed inset-0 z-[9998]">
        {trailRef.current.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0.95, scale: 1 }}
            animate={{ opacity: 0, scale: 0.15 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              left: p.x,
              top: p.y,
              background:
                theme.trail?.[p.hue] ||
                theme.trail?.[0] ||
                'radial-gradient(circle, #fff 0%, transparent 70%)',
            }}
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[2px]"
          />
        ))}
      </div>

      {/* ring */}
      <motion.div
        style={{ x: ringSX, y: ringSY, opacity: hidden ? 0 : 1 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
      >
        <div className="relative">
          <motion.div
            animate={ringStyle}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{ translateX: '-50%', translateY: '-50%' }}
            className="border-2 mix-blend-screen"
          />
        </div>
      </motion.div>

      {/* dot OR themed icon */}
      <motion.div
        style={{ x, y, opacity: hidden ? 0 : 1 }}
        className="pointer-events-none fixed left-0 top-0 z-[10000]"
      >
        {theme.icon ? (
          <motion.div
            animate={{
              scale: clicking ? 1.5 : variant === 'hover' ? 1.4 : 1,
              rotate: clicking ? -25 : variant === 'hover' ? 8 : 0,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            style={{
              translateX: '-50%',
              translateY: '-50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <theme.icon color={theme.iconColor || theme.default} size={22} />
          </motion.div>
        ) : (
          <motion.div
            animate={{
              scale: clicking ? 2.4 : variant === 'hover' ? 0 : variant === 'text' ? 0 : 1,
              backgroundColor: dotColor,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            style={{ translateX: '-50%', translateY: '-50%' }}
            className="h-2 w-2 rounded-full shadow-[0_0_14px_#fff]"
          />
        )}
      </motion.div>
    </>
  )
}
