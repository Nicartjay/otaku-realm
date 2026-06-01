import { useEffect, useState } from 'react'

/**
 * Reactive light/dark theme reader. Returns 'light' | 'dark' based on the
 * `light` class on <html>. Watches for class changes via MutationObserver so
 * components re-render when ThemeSwitch flips the mode. SSR-safe (returns
 * 'dark' on the server).
 */
export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark'
    return document.documentElement.classList.contains('light')
      ? 'light'
      : 'dark'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    const html = document.documentElement
    const update = () => {
      const next = html.classList.contains('light') ? 'light' : 'dark'
      setTheme((prev) => (prev !== next ? next : prev))
    }
    const observer = new MutationObserver(update)
    observer.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return theme
}
