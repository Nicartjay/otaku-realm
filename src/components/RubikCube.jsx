import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlitchTranslation from './GlitchTranslation'
import MagneticButton from './MagneticButton'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import useTheme from '../hooks/useTheme'

/* Encouragement blinking text — inspired by CodePen oliviale/vPvvyr "Encouragement" button.
   Positioned around the GIVE UP button at various angles, sizes, timings.
   Only visible on hover. 6 English + 6 Japanese. */
const ENCOURAGEMENTS = [
  // English — spread across all sides
  { text: 'You got this!', top: '-48px', left: '10px', rotate: '-12deg', size: '16px', delay: 0 },
  { text: 'Keep going!', top: '-44px', right: '10px', rotate: '10deg', size: '17px', delay: 0.35 },
  { text: "Don't quit!", top: '8px', left: '-90px', rotate: '-6deg', size: '20px', delay: 0.7 },
  { text: 'Almost there!', top: '12px', right: '-100px', rotate: '5deg', size: '18px', delay: 1.05 },
  { text: 'You can do it!', bottom: '-44px', left: '20px', rotate: '8deg', size: '16px', delay: 1.4 },
  { text: 'Never give up!', bottom: '-40px', right: '20px', rotate: '-7deg', size: '17px', delay: 1.75 },
  // Japanese — spread across all sides
  { text: '頑張れ!', top: '-50px', left: '-60px', rotate: '14deg', size: '18px', delay: 0.18 },
  { text: 'あきらめないで!', top: '-46px', right: '-70px', rotate: '-9deg', size: '16px', delay: 0.53 },
  { text: 'できる!', top: '14px', left: '-56px', rotate: '10deg', size: '19px', delay: 0.88 },
  { text: 'もう少し!', top: '10px', right: '-64px', rotate: '-12deg', size: '17px', delay: 1.22 },
  { text: 'ファイト!', bottom: '-46px', left: '-40px', rotate: '-8deg', size: '18px', delay: 1.57 },
  { text: '負けるな!', bottom: '-42px', right: '-50px', rotate: '6deg', size: '16px', delay: 1.92 },
]

const CUBE_HTML = `
<div class="ui">
  <div class="ui__background"></div>
  <div class="ui__game"></div>
  <div class="ui__texts">
    <div class="text text--note">Click to start</div>
    <div class="text text--timer">0:00</div>
    <div class="text text--complete"><span>Complete!</span></div>
    <div class="text text--best-time"><icon trophy></icon><span>Best Time!</span></div>
  </div>
  <div class="ui__prefs">
    <range name="size" title="Cube Size" list="2,3,4,5"></range>
    <range name="flip" title="Flip Type" list="Swift&nbsp;,Smooth,Bounce"></range>
    <range name="scramble" title="Scramble Length" list="20,25,30"></range>
    <range name="fov" title="Camera Angle" list="Ortographic,Perspective"></range>
    <range name="theme" title="Color Scheme" list="Cube,Erno,Dust,Camo,Rain"></range>
  </div>
  <div class="ui__theme">
    <range name="hue" title="Hue" color></range>
    <range name="saturation" title="Saturation" color></range>
    <range name="lightness" title="Lightness" color></range>
  </div>
  <div class="ui__stats">
    <div class="stats" name="cube-size"><i>Cube:</i><b>3x3x3</b></div>
    <div class="stats" name="total-solves"><i>Total solves:</i><b>-</b></div>
    <div class="stats" name="best-time"><i>Best time:</i><b>-</b></div>
    <div class="stats" name="worst-time"><i>Worst time:</i><b>-</b></div>
    <div class="stats" name="average-5"><i>Average of 5:</i><b>-</b></div>
    <div class="stats" name="average-12"><i>Average of 12:</i><b>-</b></div>
    <div class="stats" name="average-25"><i>Average of 25:</i><b>-</b></div>
  </div>
  <div class="ui__buttons">
    <button class="btn btn--bl btn--stats"><icon trophy></icon></button>
    <button class="btn btn--br btn--prefs"><icon settings></icon></button>
    <button class="btn btn--bl btn--back"><icon back></icon></button>
    <button class="btn btn--br btn--theme"><icon theme></icon></button>
    <button class="btn btn--br btn--reset"><icon reset></icon></button>
  </div>
</div>
`

export default function RubikCube() {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const gameRef = useRef(null)
  const initedRef = useRef(false)
  const prefersReduced = usePrefersReducedMotion()
  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)

  // IntersectionObserver — detect when section scrolls into view
  useEffect(() => {
    if (!sectionRef.current || prefersReduced) return

    const el = sectionRef.current
    let done = false

    const markVisible = () => {
      if (done) return
      done = true
      setVisible(true)
    }

    // Observer fires on first observe if already intersecting
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markVisible()
          observer.disconnect()
        }
      },
      { threshold: 0 }
    )
    observer.observe(el)

    // Fallback: check after layout settles (covers reload-at-scroll-position)
    const timer = setTimeout(() => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        markVisible()
        observer.disconnect()
      }
    }, 100)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [prefersReduced])

  // Initialize cube game only when visible
  useEffect(() => {
    if (!visible || !containerRef.current || prefersReduced || initedRef.current) return

    initedRef.current = true
    const container = containerRef.current
    container.innerHTML = CUBE_HTML

    let instance = null

    import('../lib/cubeGame.js').then(({ initCubeGame }) => {
      if (!containerRef.current) return
      try {
        instance = initCubeGame(container)
        gameRef.current = instance
        setReady(true)
      } catch (e) {
        console.error('[CubeGame] Init failed:', e)
      }
    }).catch(e => {
      console.error('[CubeGame] Import failed:', e)
    })

    return () => {
      if (instance) instance.destroy()
      gameRef.current = null
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [visible, prefersReduced])

  const handleContainerClick = () => {
    console.log('[CubeGame] Container clicked, gameRef:', !!gameRef.current)
    if (gameRef.current) {
      console.log('[CubeGame] Calling startGame')
      gameRef.current.startGame()
      setPlaying(true)
    }
  }

  // Update cube piece color and lighting when site theme changes
  useEffect(() => {
    if (!gameRef.current) return
    const g = gameRef.current.game
    if (!g || !g.themes || !g.cube || !g.world) return

    // Light mode: lighten the piece color; dark mode: restore original dark
    const lightPiece = 0xf5f0eb // warm cream for light mode piece body
    const darkPiece = 0x08101a  // original near-black for dark mode
    const pieceColor = theme === 'light' ? lightPiece : darkPiece

    // Update P color for all cube themes so switching themes while in light mode works
    Object.keys(g.themes.colors).forEach(key => {
      g.themes.colors[key].P = pieceColor
    })

    g.cube.updateColors(g.themes.getColors())

    // Significantly boost scene lighting for light mode so face colors are vivid
    const lights = g.world.lights
    if (lights) {
      if (theme === 'light') {
        lights.ambient.intensity = 2.0
        lights.front.intensity = 1.2
        lights.back.intensity = 0.6
      } else {
        // Restore original dark-mode values
        lights.ambient.intensity = 0.69
        lights.front.intensity = 0.36
        lights.back.intensity = 0.19
      }
    }
  }, [theme, ready])

  return (
    <section ref={sectionRef} id="game" className="relative pt-10 md:pt-14 pb-24 md:pb-32 overflow-hidden">
      {/* Section heading */}
      <div className="relative z-10 text-center mb-4 md:mb-6 px-4">
        <p className="font-jp text-sm md:text-base text-flame tracking-widest mb-3">
          <GlitchTranslation textKey="ゲーム — challenge" className="" />
        </p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-paper tracking-wide">
          <GlitchTranslation textKey="PUZZLE ARENA" className="" />
        </h2>
        <p className="mt-3 text-paperSoft/60 text-sm md:text-base max-w-md mx-auto">
          <GlitchTranslation textKey="solve the cube" className="" />
        </p>
      </div>

      {/* Cube container */}
      <div className="relative z-10 mx-auto w-full max-w-5xl aspect-square md:aspect-[16/10]">
        {prefersReduced ? (
          <div className="flex items-center justify-center h-full text-inkSoft/50 text-lg">
            Rubik&apos;s Cube (motion disabled)
          </div>
        ) : (
          <div
            ref={containerRef}
            className="cube-game-container w-full h-full relative"
            data-cursor="hover"
            onClick={handleContainerClick}
          />
        )}
      </div>

      {/* Give Up button — visible during play, with intro animation + encouragement blinks */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className="relative z-10 text-center mt-6"
            initial={{ opacity: 0, y: 24, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.8 }}
          >
            <div
              className="inline-block relative"
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
            >
              {/* Encouragement blinking text — only on hover */}
              {btnHovered && ENCOURAGEMENTS.map((e, i) => (
                <span
                  key={i}
                  className="absolute pointer-events-none font-display whitespace-nowrap select-none"
                  style={{
                    top: e.top,
                    bottom: e.bottom,
                    left: e.left,
                    right: e.right,
                    fontSize: e.size,
                    transform: `rotate(${e.rotate})`,
                    color: 'transparent',
                    animation: `encourageBlink 2.2s ${e.delay}s infinite`,
                    animationFillMode: 'backwards',
                  }}
                >
                  {e.text}
                </span>
              ))}

              <MagneticButton
                onClick={(e) => {
                  e.stopPropagation()
                  if (gameRef.current) {
                    gameRef.current.giveUp()
                    setPlaying(false)
                  }
                }}
                className="inline-block px-10 py-4 bg-flame hover:bg-flame/80 text-white 
                  font-display text-2xl tracking-wider rounded-sm transition-colors"
                strength={20}
                tilt={10}
                glowColor="rgba(255,45,85,0.4)"
              >
                GIVE UP
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative corner brackets */}
      <motion.div
        className="absolute top-16 left-4 w-12 h-12 border-l-2 border-t-2 border-flame/30"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-16 right-4 w-12 h-12 border-r-2 border-b-2 border-flame/30"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />
    </section>
  )
}
