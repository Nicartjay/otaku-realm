import { useCallback, useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from './icons/ui.jsx'

/**
 * Light / dark theme toggle.
 *
 * Adapted from the shadcn-style snippet (originally Next.js + TS + lucide).
 * This project is Vite + JSX + plain Tailwind, so the original `'use client'`
 * directive is dropped and lucide is replaced with our local `SunIcon` /
 * `MoonIcon` from `./icons/ui.jsx`.
 *
 * Theme initialization runs once on mount (App.jsx applies the initial class
 * synchronously before paint to avoid a flash). We listen to <html> class
 * mutations so this component stays in sync if the theme is changed elsewhere.
 *
 * Project conventions:
 *   - `data-cursor="hover"` opts the custom cursor into its hover state
 *   - `focus-ring` gives visible keyboard focus (mouse cursor is `cursor: none`)
 *   - currentColor inherits from `text-paper` so it tracks the active palette
 */
export function ThemeSwitch({ className = '' }) {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark'
    return document.documentElement.classList.contains('light') ? 'light' : 'dark'
  })

  // Keep state synced if some other code (App.jsx init) flips the class.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const observer = new MutationObserver(() => {
      const next = document.documentElement.classList.contains('light')
        ? 'light'
        : 'dark'
      setTheme((prev) => (prev !== next ? next : prev))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // localStorage may be unavailable (private mode); ignore
    }
    document.documentElement.classList.toggle('light', next === 'light')
    // Also toggle `dark` class for parity with shadcn-style libraries that
    // expect it. Tailwind is configured with darkMode: 'class' so the
    // absence of `light` already means dark, but this keeps third-party
    // hooks happy.
    document.documentElement.classList.toggle('dark', next === 'dark')
  }, [theme])

  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-cursor="hover"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={isLight}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`focus-ring relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-paper transition-opacity hover:opacity-80 ${className}`}
    >
      <SunIcon
        size={18}
        className={`absolute transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isLight
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-5 scale-50 opacity-0'
        }`}
      />
      <MoonIcon
        size={18}
        className={`absolute transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          !isLight
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-5 scale-50 opacity-0'
        }`}
      />
    </button>
  )
}

export default ThemeSwitch
