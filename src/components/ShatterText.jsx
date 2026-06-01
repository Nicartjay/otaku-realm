import { useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/**
 * ShatterText — shattering/assembling text reveal animation.
 *
 * Splits `text` into individual characters. Each character starts scattered
 * (random x/y offset, rotation, scale=0, opacity=0) and stagger-animates
 * into place when scrolled into view.
 *
 * Inspired by: https://codepen.io/ARS/pen/pjypwd
 *
 * Props:
 *  - text: string to render (required)
 *  - as: wrapper element type (default 'span')
 *  - className: passed to wrapper
 *  - style: inline styles for the wrapper (also inherited by chars for gradients)
 *  - charClassName: class for each character span
 *  - charStyle: inline style applied to each character span (use for gradient text)
 *  - stagger: delay between each character (default 0.03)
 *  - duration: animation duration per character (default 0.6)
 *  - scatter: max scatter distance in px (default 150)
 *  - once: only animate once (default true)
 *  - delay: initial delay before stagger starts (default 0)
 */
export default function ShatterText({
  text,
  as: Tag = 'span',
  className = '',
  style: wrapperStyle,
  charClassName = '',
  charStyle,
  stagger = 0.03,
  duration = 0.6,
  scatter = 150,
  once = true,
  delay = 0,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: 0.3 })
  const reduce = usePrefersReducedMotion()

  // Generate stable random offsets per character (memoized on text)
  const charData = useMemo(() => {
    return text.split('').map(() => ({
      x: (Math.random() - 0.5) * 2 * scatter,
      y: (Math.random() - 0.5) * 2 * scatter,
      rotate: (Math.random() - 0.5) * 720,
    }))
  }, [text, scatter])

  // Reduced motion — render plain text, no animation
  if (reduce) {
    return <Tag className={className} style={wrapperStyle}>{text}</Tag>
  }

  return (
    <Tag ref={ref} className={className} style={wrapperStyle} aria-label={text}>
      {text.split('').map((char, i) => {
        const isSpace = char === ' '
        return (
          <motion.span
            key={`${i}-${char}`}
            className={isSpace ? undefined : charClassName}
            style={{
              display: 'inline-block',
              whiteSpace: isSpace ? 'pre' : undefined,
              ...(!isSpace ? charStyle : undefined),
            }}
            aria-hidden="true"
            initial={{
              x: charData[i].x,
              y: charData[i].y,
              rotate: charData[i].rotate,
              scale: 0,
              opacity: 0,
            }}
            animate={
              isInView
                ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                : { x: charData[i].x, y: charData[i].y, rotate: charData[i].rotate, scale: 0, opacity: 0 }
            }
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {isSpace ? '\u00A0' : char}
          </motion.span>
        )
      })}
    </Tag>
  )
}
