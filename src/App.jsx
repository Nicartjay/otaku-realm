import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import Cursor from './components/Cursor.jsx'
import ParticleField from './components/ParticleField.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import AnimeDetail from './pages/AnimeDetail.jsx'
import { CursorThemeProvider } from './context/CursorThemeContext.jsx'

function Loader({ onDone }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const dur = 1600
    let raf
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / dur)
      setProgress(Math.floor(t * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setTimeout(onDone, 250)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-ink"
    >
      <div className="halftone absolute inset-0 opacity-30" />
      <div className="relative text-center">
        <div className="font-jp text-sm tracking-widest text-sun">起動中</div>
        <div className="mt-2 font-display text-7xl">
          <span className="gradient-shonen animate-sweep">LOADING</span>
        </div>
        <div className="mt-6 h-[3px] w-[280px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
            className="h-full rounded-full bg-gradient-to-r from-flame to-sun"
          />
        </div>
        <div className="mt-2 font-mono text-xs tracking-[0.4em] text-white/60">
          {progress.toString().padStart(3, '0')}%
        </div>
      </div>
    </motion.div>
  )
}

/** Page transition wrapper — fades + small slide between routes. */
function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:slug" element={<AnimeDetail />} />
          <Route
            path="*"
            element={
              <div className="flex min-h-screen items-center justify-center pt-24">
                <h1 className="font-display text-6xl text-flame">404</h1>
              </div>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <BrowserRouter>
      <CursorThemeProvider>
        <Cursor />
        <AnimatePresence>
          {loading && <Loader onDone={() => setLoading(false)} />}
        </AnimatePresence>

        <ParticleField />
        <Navbar />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.8, delay: loading ? 0 : 0.1 }}
          className="relative z-10"
        >
          <AnimatedRoutes />
          <Footer />
        </motion.main>
      </CursorThemeProvider>
    </BrowserRouter>
  )
}
