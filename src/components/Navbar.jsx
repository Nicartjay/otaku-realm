import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ThemeSwitch from './ThemeSwitch.jsx'

const NAV = [
  ['Home', 'hero'],
  ['Anime', 'anime'],
  ['Heroes', 'characters'],
  ['Saga', 'about'],
  ['Quotes', 'quotes'],
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goSection = (id) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      // Scroll after route change
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? 'border-b border-white/10 bg-ink/70 backdrop-blur'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          data-cursor="hover"
          className="focus-ring font-display text-2xl tracking-wider"
        >
          <span className="gradient-shonen animate-sweep">OTAKU</span>
          <span className="ml-1 text-white">REALM</span>
        </Link>

        <nav className="hidden gap-8 md:flex">
          {NAV.map(([l, id]) => (
            <button
              key={l}
              onClick={() => goSection(id)}
              data-cursor="hover"
              className="focus-ring group relative text-sm uppercase tracking-[0.3em] text-white/80 transition hover:text-flame"
            >
              {l}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-flame transition-all group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeSwitch />

          <button
            data-cursor="hover"
            onClick={() => setOpen((v) => !v)}
            className="focus-ring flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded border border-white/20 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <span
              className={`h-[2px] w-5 bg-white transition ${open ? 'translate-y-[6px] rotate-45' : ''}`}
            />
            <span
              className={`h-[2px] w-5 bg-white transition ${open ? 'opacity-0' : ''}`}
            />
            <span
              className={`h-[2px] w-5 bg-white transition ${open ? '-translate-y-[6px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-ink/90 backdrop-blur"
          >
            <ul className="flex flex-col px-6 py-4">
              {NAV.map(([l, id]) => (
                <li key={l}>
                  <button
                    onClick={() => goSection(id)}
                    data-cursor="hover"
                    className="focus-ring block w-full py-3 text-left font-display tracking-wider text-white/90"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
