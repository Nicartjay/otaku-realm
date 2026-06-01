import { forwardRef, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Mouse-interactive button.
 *
 * Effects on hover:
 *   - magnetic pull: button shifts up to ±strength px toward the cursor
 *   - 3D tilt: rotateX/Y up to ±tilt deg based on cursor offset
 *   - inner glow: radial gradient follows the cursor (CSS vars --mx/--my)
 *   - press: scales down on pointerdown, springs back on up
 *
 * Renders an <a> when `href` is given, otherwise a <button>.
 * Forwards everything else (children, className, onClick, target, etc.).
 *
 * Props:
 *   strength  - max magnetic pull in px (default 16)
 *   tilt      - max tilt in deg (default 8)
 *   glow      - whether to render the cursor-follow glow (default true)
 *   glowColor - rgb/hex for the glow (default 'rgba(255,255,255,0.35)')
 */
const MagneticButton = forwardRef(function MagneticButton(
  {
    children,
    href,
    className = '',
    strength = 16,
    tilt = 8,
    glow = true,
    glowColor = 'rgba(255,255,255,0.35)',
    asChild = false,
    onMouseMove,
    onMouseLeave,
    onPointerDown,
    onPointerUp,
    style,
    ...rest
  },
  ref
) {
  const localRef = useRef(null)
  const setRefs = (node) => {
    localRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  // Raw mouse offsets relative to button center (range roughly -1 to 1)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  // Springs for smooth movement / settle
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 })

  // Magnetic translation (px)
  const x = useTransform(sx, (v) => v * strength)
  const y = useTransform(sy, (v) => v * strength)

  // 3D tilt (deg) — invert Y so pushing up tilts top backwards
  const rotateY = useTransform(sx, (v) => v * tilt)
  const rotateX = useTransform(sy, (v) => -v * tilt)

  const handleMove = (e) => {
    const el = localRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    mx.set(Math.max(-1, Math.min(1, px)))
    my.set(Math.max(-1, Math.min(1, py)))
    // Pixel coords for the inner glow
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
    onMouseMove?.(e)
  }

  const handleLeave = (e) => {
    mx.set(0)
    my.set(0)
    onMouseLeave?.(e)
  }

  const handleDown = (e) => {
    const el = localRef.current
    if (el) el.style.setProperty('--press', '0.96')
    onPointerDown?.(e)
  }
  const handleUp = (e) => {
    const el = localRef.current
    if (el) el.style.setProperty('--press', '1')
    onPointerUp?.(e)
  }

  const Tag = href ? motion.a : motion.button

  return (
    <Tag
      ref={setRefs}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      data-cursor="hover"
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformPerspective: 600,
        transformStyle: 'preserve-3d',
        scale: 'var(--press, 1)',
        ...style,
      }}
      className={`focus-ring relative inline-block will-change-transform ${className}`}
      {...rest}
    >
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:opacity-100"
          style={{
            background: `radial-gradient(160px circle at var(--mx, 50%) var(--my, 50%), ${glowColor}, transparent 60%)`,
            mixBlendMode: 'screen',
            opacity: 1,
          }}
        />
      )}
      <span className="relative z-10 inline-flex h-full w-full items-center justify-center gap-2">
        {children}
      </span>
    </Tag>
  )
})

export default MagneticButton
