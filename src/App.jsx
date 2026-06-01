import { useState } from 'react'
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
import DriftLoader from './components/DriftLoader.jsx'
import { CursorThemeProvider } from './context/CursorThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

/** Page transition wrapper — fades + small slide between routes. */
function AnimatedRoutes({ loaded }) {
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
          <Route path="/" element={<Home autoScroll={loaded} />} />
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
  const [scrollReady, setScrollReady] = useState(false)

  return (
    <BrowserRouter>
      <LanguageProvider>
      <CursorThemeProvider>
        <Cursor />
        {loading && (
          <DriftLoader
            onDone={() => setLoading(false)}
            onFillStart={() => setScrollReady(true)}
          />
        )}

        <ParticleField />
        <Navbar />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0 }}
          className="relative z-10"
        >
          <AnimatedRoutes loaded={scrollReady} />
          <Footer />
        </motion.main>
      </CursorThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
