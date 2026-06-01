import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import GlitchText from './GlitchText.jsx'
import MagneticButton from './MagneticButton.jsx'
import { SparkleIcon, ChevronDownIcon } from './icons/ui.jsx'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const yBack = useTransform(scrollYProgress, [0, 1], [0, 200])
  const yMid = useTransform(scrollYProgress, [0, 1], [0, 120])
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 60])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background image — anime collage from MAL CDN */}
      <motion.div
        style={{ y: yBack, scale: bgScale }}
        className="absolute inset-0"
      >
        <img
          src="https://cdn.myanimelist.net/images/anime/1517/100633l.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <img
          src="https://cdn.myanimelist.net/images/anime/1286/99889l.jpg"
          alt=""
          className="absolute inset-y-0 left-0 hidden h-full w-1/2 object-cover opacity-25 md:block"
          style={{ maskImage: 'linear-gradient(to right, black, transparent)' }}
        />
        <img
          src="https://cdn.myanimelist.net/images/anime/1171/109222l.jpg"
          alt=""
          className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-25 md:block"
          style={{ maskImage: 'linear-gradient(to left, black, transparent)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
      </motion.div>

      {/* Parallax sun */}
      <motion.div
        style={{ y: yBack }}
        className="absolute left-1/2 top-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-flame via-sun to-flame blur-2xl opacity-50"
      />
      <motion.div
        style={{ y: yBack, rotate: 8 }}
        className="absolute left-1/2 top-[28%] h-[460px] w-[460px] -translate-x-1/2 rounded-full border-[6px] border-dashed border-sun/60 animate-spinSlow"
      />

      {/* halftone */}
      <motion.div
        style={{ y: yMid }}
        className="halftone absolute inset-0 opacity-30"
      />

      {/* speed lines */}
      <div className="speed-lines absolute inset-0 mix-blend-overlay opacity-30" />

      {/* noise */}
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      {/* Content */}
      <motion.div
        style={{ y: yFront, opacity }}
        className="relative z-10 px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-flame/60 bg-ink/60 px-4 py-1 text-xs uppercase tracking-[0.4em] text-sun backdrop-blur"
        >
          <SparkleIcon size={12} className="text-sun" />
          Otaku Realm
          <SparkleIcon size={12} className="text-sun" />
        </motion.div>

        <h1 className="font-display text-7xl leading-none sm:text-8xl md:text-9xl">
          <span className="gradient-shonen animate-sweep">
            <GlitchText text="POWER" />
          </span>
          <br />
          <span className="text-stroke-white text-transparent">
            <GlitchText text="UNLEASHED" />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mx-auto mt-6 max-w-xl text-base text-white/80 md:text-lg"
        >
          A vibrant tribute to the worlds, heroes, and battles that shaped a
          generation. Scroll. Hover. Awaken your inner main character.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <MagneticButton
            href="#anime"
            strength={20}
            tilt={10}
            glowColor="rgba(255,255,255,0.45)"
            className="rounded-full bg-flame px-7 py-3 font-display text-lg tracking-wider text-ink shadow-[0_0_30px_rgba(255,45,85,0.5)]"
          >
            ENTER REALM
          </MagneticButton>
          <MagneticButton
            href="#characters"
            strength={18}
            tilt={8}
            glowColor="rgba(255,201,60,0.35)"
            className="rounded-full border-2 border-sun px-7 py-3 font-display text-lg tracking-wider text-sun"
          >
            MEET HEROES
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.4, duration: 1.6, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/60"
      >
        scroll
        <ChevronDownIcon size={14} className="text-white/60" />
      </motion.div>
    </section>
  )
}
