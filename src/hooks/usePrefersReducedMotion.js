import { useEffect, useState } from 'react'

/**
 * Reactive `prefers-reduced-motion: reduce` media-query hook.
 *
 * Animation rule for this app: ADDITIVE only. Default is the full motion-rich
 * experience. Components opt-in to a static fallback ONLY for users who have
 * explicitly requested reduced motion at the OS level. Returns `true` when
 * such users are present.
 *
 * Usage:
 *   const reduce = usePrefersReducedMotion()
 *   if (reduce) // render the static branch
 */
export default function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setReduce(e.matches)
    if (mql.addEventListener) mql.addEventListener('change', handler)
    else mql.addListener(handler)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler)
      else mql.removeListener(handler)
    }
  }, [])

  return reduce
}
