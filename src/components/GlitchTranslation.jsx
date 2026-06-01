import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { t } from '../data/translations.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/**
 * GlitchTranslation — renders translated text with a glitch scramble
 * animation when the language changes.
 *
 * Props:
 *  - textKey: the English key that doubles as both the EN display and
 *             the lookup key for JP translation
 *  - className: passed to the wrapping <span>
 *  - as: element type (default 'span')
 *  - speed: ms per character reveal (default 35)
 *
 * On language change, characters scramble through random kana/symbols
 * before resolving to the target text, mimicking the existing GlitchText
 * aesthetic. Reduced-motion users see an instant swap.
 */
export default function GlitchTranslation({
  textKey,
  className = '',
  as: Tag = 'span',
  speed = 35,
}) {
  const { lang } = useLanguage()
  const reduce = usePrefersReducedMotion()
  const target = t(textKey, lang)
  const [display, setDisplay] = useState(target)
  const prevLang = useRef(lang)
  const frameRef = useRef(null)

  useEffect(() => {
    // If language hasn't changed (initial mount), just set directly
    if (prevLang.current === lang && display === target) return

    prevLang.current = lang

    // Reduced motion: instant swap
    if (reduce) {
      setDisplay(target)
      return
    }

    // Glitch scramble animation
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ!@#$%&*刀魂忍鬼炎風雷水火土'
    const len = Math.max(display.length, target.length)
    let i = 0
    const totalSteps = len

    const tick = () => {
      if (i <= totalSteps) {
        const resolved = target.slice(0, i)
        const noiseLen = Math.max(0, target.length - i)
        const noise = Array.from({ length: noiseLen }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join('')
        setDisplay(resolved + noise)
        i++
        frameRef.current = setTimeout(tick, speed)
      } else {
        setDisplay(target)
      }
    }

    // Small initial delay so the user sees the scramble start
    frameRef.current = setTimeout(tick, 50)

    return () => {
      if (frameRef.current) clearTimeout(frameRef.current)
    }
  }, [lang, target]) // eslint-disable-line react-hooks/exhaustive-deps

  return <Tag className={className}>{display}</Tag>
}
