import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/**
 * Glitch-reveal text. Cycles random kana/symbols then locks in the final string.
 *
 * Default: full glitch reveal (60ms per char + ongoing `animate-glitch` jitter).
 * `prefers-reduced-motion: reduce`: shows the final text instantly with no
 * ongoing jitter, preserving meaning while sparing photosensitive users.
 */
export default function GlitchText({ text, className = '' }) {
  const reduce = usePrefersReducedMotion()
  const [shown, setShown] = useState(reduce ? text : '')
  const [done, setDone] = useState(reduce)

  useEffect(() => {
    if (reduce) {
      setShown(text)
      setDone(true)
      return
    }
    let i = 0
    const chars = '!@#$%^&*<>/\\アニメ刀魂忍鬼'
    let frame
    const tick = () => {
      if (i <= text.length) {
        const visible = text.slice(0, i)
        const noise = Array.from({ length: Math.max(0, text.length - i) }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join('')
        setShown(visible + noise)
        i++
        frame = setTimeout(tick, 60)
      } else {
        setShown(text)
        setDone(true)
      }
    }
    tick()
    return () => clearTimeout(frame)
  }, [text, reduce])

  return (
    <span className={className}>
      <AnimatePresence>
        <motion.span
          key={done ? 'done' : 'glitching'}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className={done && !reduce ? 'animate-glitch' : ''}
        >
          {shown}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
