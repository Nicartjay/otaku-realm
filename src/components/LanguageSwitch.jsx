import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext.jsx'

/**
 * Language toggle button — EN / JP with glitch-style transition.
 * Sits beside the ThemeSwitch in the Navbar.
 * Uses the same sizing/styling conventions as ThemeSwitch for consistency.
 */
export default function LanguageSwitch({ className = '' }) {
  const { lang, toggle } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="hover"
      aria-label={lang === 'en' ? 'Switch to Japanese' : '英語に切り替え'}
      title={lang === 'en' ? 'Switch to Japanese' : '英語に切り替え'}
      className={`focus-ring relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-paper transition-opacity hover:opacity-80 ${className}`}
    >
      <motion.span
        key={lang}
        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
        transition={{ duration: 0.3 }}
        className="font-jp text-sm font-bold"
      >
        {lang === 'en' ? 'JP' : 'EN'}
      </motion.span>
    </button>
  )
}
