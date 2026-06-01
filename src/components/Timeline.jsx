import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import GlitchTranslation from './GlitchTranslation.jsx'
import ShatterText from './ShatterText.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { t as tr } from '../data/translations.js'

const TIMELINE = [
  {
    year: '1963',
    titleKey: 'Astro Boy takes flight',
    textKey: 'Astro Boy timeline',
    color: '#ff3b3b',
    image: 'https://media.kitsu.app/anime/cover_images/2748/large.jpg',
  },
  {
    year: '1988',
    titleKey: 'Akira changes everything',
    textKey: 'Akira timeline',
    color: '#ffb703',
    image: 'https://media.kitsu.app/anime/cover_images/29/large.jpg',
  },
  {
    year: '1989',
    titleKey: 'Dragon Ball Z powers up',
    textKey: 'DBZ timeline',
    color: '#f59e0b',
    image: 'https://media.kitsu.app/anime/cover_images/4394/large.jpg',
  },
  {
    year: '1996',
    titleKey: 'Detective Conan cracks the case',
    textKey: 'Conan timeline',
    color: '#1e90ff',
    image: 'https://media.kitsu.app/anime/cover_images/210/large.jpg',
  },
  {
    year: '1997',
    titleKey: 'Pokémon goes global',
    textKey: 'Pokemon timeline',
    color: '#00e5ff',
    image: 'https://media.kitsu.app/anime/cover_images/486/large.jpg',
  },
  {
    year: '1999',
    titleKey: 'One Piece sets sail',
    textKey: 'OP timeline',
    color: '#fbbf24',
    image: 'https://media.kitsu.app/anime/12/cover_image/large-3e72f400a87b5241780c5082f0582611.jpeg',
  },
  {
    year: '2002',
    titleKey: 'Naruto begins',
    textKey: 'Naruto timeline',
    color: '#ffb703',
    image: 'https://media.kitsu.app/anime/cover_images/1555/large.jpg',
  },
  {
    year: '2006',
    titleKey: 'Death Note rewrites justice',
    textKey: 'DN timeline',
    color: '#6b21a8',
    image: 'https://media.kitsu.app/anime/cover_images/1376/large.jpg',
  },
  {
    year: '2009',
    titleKey: 'Fullmetal Alchemist transcends',
    textKey: 'FMA timeline',
    color: '#dc2626',
    image: 'https://media.kitsu.app/anime/cover_images/3936/large.jpg',
  },
  {
    year: '2012',
    titleKey: 'Sword Art Online logs in',
    textKey: 'SAO timeline',
    color: '#3b82f6',
    image: 'https://media.kitsu.app/anime/cover_images/6589/large.jpg',
  },
  {
    year: '2013',
    titleKey: 'Walls fall in Attack on Titan',
    textKey: 'AoT timeline',
    color: '#c0392b',
    image: 'https://media.kitsu.app/anime/cover_images/7442/large.jpg',
  },
  {
    year: '2014',
    titleKey: 'Tokyo Ghoul unleashes hunger',
    textKey: 'TG timeline',
    color: '#ef4444',
    image: 'https://media.kitsu.app/anime/cover_images/8271/large.jpg',
  },
  {
    year: '2016',
    titleKey: 'My Hero Academia rises',
    textKey: 'MHA timeline',
    color: '#22d3ee',
    image: 'https://media.kitsu.app/anime/cover_images/11469/large.jpg',
  },
  {
    year: '2019',
    titleKey: 'Demon Slayer breaks records',
    textKey: 'DS timeline',
    color: '#ff3b3b',
    image: 'https://media.kitsu.app/anime/41370/cover_image/large-3de3cc6d2b33162c928de10aa201e4ba.jpeg',
  },
  {
    year: '2020',
    titleKey: 'Jujutsu Kaisen curses the world',
    textKey: 'JJK timeline',
    color: '#a855f7',
    image: 'https://media.kitsu.app/anime/cover_images/42765/large.jpg',
  },
]

/* A single image layer with clip-path reveal driven by scroll */
function ImageLayer({ item, index, total, scrollYProgress }) {
  const segmentSize = 1 / (total - 1)
  const start = index * segmentSize
  const end = start + segmentSize

  // Use function-form to avoid WAAPI offset issues
  const clipPath = useTransform(scrollYProgress, (p) => {
    if (p <= start) return 'inset(0 0% 0 0)'
    if (p >= end) return 'inset(0 100% 0 0)'
    const pct = ((p - start) / (end - start)) * 100
    return `inset(0 ${pct}% 0 0)`
  })

  const isLast = index === total - 1

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        zIndex: total - index,
        clipPath: isLast ? 'none' : clipPath,
      }}
    >
      <img
        src={item.image}
        alt={item.titleKey}
        className="h-full w-full object-cover"
        decoding="async"
      />
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    </motion.div>
  )
}

/* Text overlay rendered separately (outside clip-path) */
function TextOverlay({ item, index, total, scrollYProgress, lang }) {
  const segmentSize = 1 / (total - 1)
  const start = index * segmentSize
  const end = start + segmentSize
  const isFirst = index === 0
  const isLast = index === total - 1

  // Use function-form useTransform to avoid WAAPI offset constraints.
  // Each text is visible only during its own segment [start, end].
  const textOpacity = useTransform(scrollYProgress, (p) => {
    const pad = segmentSize * 0.1 // fade duration as fraction of segment
    if (isFirst) {
      // Visible immediately, fades out at end
      if (p <= end - pad) return 1
      if (p >= end) return 0
      return 1 - (p - (end - pad)) / pad
    }
    if (isLast) {
      // Fades in as previous layer finishes clipping away, stays visible
      const fadeStart = start - segmentSize * 0.15
      const fadeEnd = start
      if (p >= fadeEnd) return 1
      if (p <= fadeStart) return 0
      return (p - fadeStart) / (fadeEnd - fadeStart)
    }
    // Middle: fade in at start, fade out at end
    if (p <= start) return 0
    if (p < start + pad) return (p - start) / pad
    if (p <= end - pad) return 1
    if (p < end) return 1 - (p - (end - pad)) / pad
    return 0
  })

  return (
    <motion.div
      className="absolute bottom-0 left-0 p-6 md:p-10"
      style={{ opacity: textOpacity, zIndex: 50 + total - index }}
    >
      <span
        className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm"
        style={{
          background: `${item.color}33`,
          color: item.color,
          border: `1px solid ${item.color}66`,
        }}
      >
        Stage {index + 1}
      </span>
      <div
        className="font-display text-5xl font-bold md:text-7xl"
        style={{ color: item.color }}
      >
        {item.year}
      </div>
      <h3 className={`mt-2 ${lang === 'jp' ? 'font-pop' : 'font-display'} text-xl text-white md:text-2xl`}>
        <GlitchTranslation textKey={item.titleKey} speed={30} />
      </h3>
      <p className="mt-2 max-w-md text-sm text-white/70 md:text-base">
        <GlitchTranslation textKey={item.textKey} speed={18} />
      </p>
    </motion.div>
  )
}

/* Divider line that sweeps across during transitions */
function DividerLine({ index, total, scrollYProgress, color }) {
  const segmentSize = 1 / (total - 1)
  const start = index * segmentSize
  const end = start + segmentSize

  const left = useTransform(scrollYProgress, (p) => {
    if (p <= start) return '100%'
    if (p >= end) return '0%'
    const pct = 100 - ((p - start) / (end - start)) * 100
    return `${pct}%`
  })
  const opacity = useTransform(scrollYProgress, (p) => {
    const pad = 0.01
    if (p <= start || p >= end) return 0
    if (p < start + pad) return (p - start) / pad
    if (p > end - pad) return (end - p) / pad
    return 1
  })

  return (
    <motion.div
      className="pointer-events-none absolute inset-y-0 z-20 w-px"
      style={{
        left,
        opacity,
        background: color,
        boxShadow: `0 0 12px ${color}, 0 0 24px ${color}55`,
      }}
    >
      {/* Handle dot */}
      <div
        className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 16px ${color}`,
        }}
      />
    </motion.div>
  )
}

/* Stage navigation dots */
function StageNav({ total, scrollYProgress }) {
  return (
    <div className="absolute right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2 md:right-6">
      {Array.from({ length: total }, (_, i) => (
        <StageIndicator
          key={i}
          index={i}
          total={total}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  )
}

function StageIndicator({ index, total, scrollYProgress }) {
  const segmentSize = 1 / (total - 1)
  const myStart = index === 0 ? 0 : (index - 0.5) * segmentSize
  const myEnd = index === total - 1 ? 1 : (index + 0.5) * segmentSize
  const mid = (myStart + myEnd) / 2

  const scale = useTransform(scrollYProgress, (p) => {
    if (p <= myStart || p >= myEnd) return 1
    const t = p < mid ? (p - myStart) / (mid - myStart) : 1 - (p - mid) / (myEnd - mid)
    return 1 + t * 0.5
  })
  const opacity = useTransform(scrollYProgress, (p) => {
    if (p <= myStart || p >= myEnd) return 0.4
    const t = p < mid ? (p - myStart) / (mid - myStart) : 1 - (p - mid) / (myEnd - mid)
    return 0.4 + t * 0.6
  })
  const height = useTransform(scrollYProgress, (p) => {
    if (p <= myStart || p >= myEnd) return '0.5rem'
    const t = p < mid ? (p - myStart) / (mid - myStart) : 1 - (p - mid) / (myEnd - mid)
    return `${0.5 + t * 0.5}rem`
  })

  return (
    <motion.div
      className="w-2 rounded-full bg-white"
      style={{ scale, opacity, height }}
    />
  )
}

/* Percentage counter */
function ProgressCounter({ scrollYProgress }) {
  const progress = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <motion.div className="absolute bottom-4 right-4 z-30 font-display text-lg tabular-nums text-white/80 md:right-6 md:text-xl">
      <motion.span>
        {/* use motion value to update text */}
        <ProgressText progress={progress} />
      </motion.span>
    </motion.div>
  )
}

function ProgressText({ progress }) {
  const ref = useRef(null)

  // Subscribe to motion value changes
  progress.on('change', (v) => {
    if (ref.current) {
      ref.current.textContent = `${String(Math.round(v)).padStart(2, '0')}%`
    }
  })

  return <span ref={ref}>00%</span>
}

/* 3D perspective wrapper driven by scroll */
function ComparatorWrapper({ children, scrollYProgress }) {
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [6, 0, 0, -6]
  )
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [-6, 0, 0, 6]
  )
  const rotateZ = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [-2, 0, 0, 2]
  )
  const scale = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0.92, 1, 1, 0.92]
  )
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0.85, 1, 1, 0.85]
  )

  return (
    <motion.div
      className="relative mx-auto aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-xl md:aspect-[16/9]"
      style={{
        perspective: '1200px',
      }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          rotateX,
          rotateY,
          rotateZ,
          scale,
          opacity,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function Timeline() {
  const { lang } = useLanguage()
  const sectionRef = useRef(null)
  const total = TIMELINE.length

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="about" className="relative">
      {/* Section header (outside scroll area) */}
      <div className="px-6 pb-8 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl text-center"
        >
          <div className="font-jp mb-2 text-sm tracking-wider text-sakura">
            歴史 — <GlitchTranslation textKey="history" speed={30} />
          </div>
          <h2 className={`text-5xl md:text-6xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
            <ShatterText text={tr('SAGA', lang)} className="gradient-shonen animate-sweep" charClassName="inline-block" />{' '}
            <ShatterText text={tr('OF THE MEDIUM', lang)} className="text-white" charClassName="inline-block" delay={0.1} />
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">
            <GlitchTranslation textKey="Scroll to reveal" speed={25} />
          </p>
        </motion.div>
      </div>

      {/* Scroll-driven comparator area */}
      <div ref={sectionRef} className="relative" style={{ height: `${(total + 1) * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center justify-center px-4">
          <ComparatorWrapper scrollYProgress={scrollYProgress}>
            {/* Image layers */}
            <div className="relative h-full w-full">
              {TIMELINE.map((item, i) => (
                <ImageLayer
                  key={item.year}
                  item={item}
                  index={i}
                  total={total}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>

            {/* Text overlays (outside clip containers so they're never clipped) */}
            {TIMELINE.map((item, i) => (
              <TextOverlay
                key={`text-${item.year}`}
                item={item}
                index={i}
                total={total}
                scrollYProgress={scrollYProgress}
                lang={lang}
              />
            ))}

            {/* Divider lines */}
            {TIMELINE.slice(0, -1).map((item, i) => (
              <DividerLine
                key={`div-${item.year}`}
                index={i}
                total={total}
                scrollYProgress={scrollYProgress}
                color={item.color}
              />
            ))}

            {/* Stage navigation dots */}
            <StageNav total={total} scrollYProgress={scrollYProgress} />

            {/* Progress percentage */}
            <ProgressCounter scrollYProgress={scrollYProgress} />
          </ComparatorWrapper>
        </div>
      </div>
    </section>
  )
}
