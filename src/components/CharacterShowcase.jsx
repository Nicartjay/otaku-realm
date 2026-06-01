import { motion } from 'framer-motion'
import { useRef, useEffect, useCallback, useState } from 'react'
import GlitchTranslation from './GlitchTranslation.jsx'
import ShatterText from './ShatterText.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { t } from '../data/translations.js'

const CHARS = [
  {
    name: 'Tanjiro Kamado',
    title: 'Demon Slayer Corps',
    aura: '#ff3b3b',
    quote: '"Set your heart ablaze."',
    initial: '炭',
    image: 'https://cdn.myanimelist.net/images/characters/6/386735.jpg',
  },
  {
    name: 'Naruto Uzumaki',
    title: 'Hokage in Training',
    aura: '#ffb703',
    quote: '"I never go back on my word."',
    initial: 'ナ',
    image: 'https://cdn.myanimelist.net/images/characters/2/284121.jpg',
  },
  {
    name: 'Satoru Gojo',
    title: 'The Honored One',
    aura: '#a855f7',
    quote: '"Throughout heaven and earth, I alone am the honored one."',
    initial: '悟',
    image: 'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
  },
  {
    name: 'Izuku Midoriya',
    title: 'Symbol of Hope',
    aura: '#22d3ee',
    quote: '"Plus Ultra!"',
    initial: '出',
    image: 'https://cdn.myanimelist.net/images/characters/7/299404.jpg',
  },
  {
    name: 'Mikasa Ackerman',
    title: 'Survey Corps Vanguard',
    aura: '#ff5ea8',
    quote: '"This world is cruel — but also very beautiful."',
    initial: '兵',
    image: 'https://cdn.myanimelist.net/images/characters/9/215563.jpg',
  },
  {
    name: 'Monkey D. Luffy',
    title: 'Future King of the Pirates',
    aura: '#fbbf24',
    quote: '"I\'m gonna be King of the Pirates!"',
    initial: '海',
    image: 'https://cdn.myanimelist.net/images/characters/9/310307.jpg',
  },
  {
    name: 'Son Goku',
    title: 'Saiyan Warrior',
    aura: '#f59e0b',
    quote: '"I am the hope of the universe!"',
    initial: '悟',
    image: 'https://cdn.myanimelist.net/images/characters/15/72546.jpg',
  },
  {
    name: 'Edward Elric',
    title: 'Fullmetal Alchemist',
    aura: '#dc2626',
    quote: '"A lesson without pain is meaningless."',
    initial: '鋼',
    image: 'https://cdn.myanimelist.net/images/characters/9/72533.jpg',
  },
  {
    name: 'Light Yagami',
    title: 'God of the New World',
    aura: '#6b21a8',
    quote: '"I am justice!"',
    initial: '月',
    image: 'https://cdn.myanimelist.net/images/characters/6/63870.jpg',
  },
  {
    name: 'Kirito',
    title: 'Black Swordsman',
    aura: '#3b82f6',
    quote: '"There is one thing I\'ve learned here — to keep fighting."',
    initial: '剣',
    image: 'https://cdn.myanimelist.net/images/characters/7/204821.jpg',
  },
  {
    name: 'Ken Kaneki',
    title: 'One-Eyed King',
    aura: '#ef4444',
    quote: '"What is 1000 minus 7?"',
    initial: '喰',
    image: 'https://cdn.myanimelist.net/images/characters/15/307255.jpg',
  },
]

/* ---------- helpers ---------- */
const lerp = (a, b, t) => (1 - t) * a + t * b
const remap = (value, oldMax, newMax) => {
  const v = ((value + oldMax) * (newMax * 2)) / (oldMax * 2) - newMax
  return Math.min(Math.max(v, -newMax), newMax)
}
const ANGLE = 15

/* ---------- single 3D card ---------- */
function Card3D({ ch, index }) {
  const ref = useRef(null)
  const frameRef = useRef(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const updateStyle = useCallback(() => {
    const el = ref.current
    if (!el) return
    currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.06)
    currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.06)
    el.style.setProperty('--rx', currentRef.current.y + 'deg')
    el.style.setProperty('--ry', currentRef.current.x + 'deg')
    frameRef.current = requestAnimationFrame(updateStyle)
  }, [])

  useEffect(() => {
    frameRef.current = requestAnimationFrame(updateStyle)
    return () => cancelAnimationFrame(frameRef.current)
  }, [updateStyle])

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const rect = el.getBoundingClientRect()
    const cx = (rect.left + rect.right) / 2
    const cy = (rect.top + rect.bottom) / 2
    const px = clientX - cx
    const py = clientY - cy
    targetRef.current.x = remap(px, rect.width / 2, ANGLE)
    targetRef.current.y = -remap(py, rect.height / 2, ANGLE)
  }

  const handleLeave = () => {
    targetRef.current = { x: 0, y: 0 }
  }

  const borderSide = index % 3 === 0 ? 'left' : index % 3 === 1 ? 'right' : 'bottom'

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="hover"
      className="char3d-card"
      style={{ '--aura': ch.aura }}
    >
      {/* shadow layer (blurred behind) */}
      <div
        className="char3d-shadow"
        style={{ backgroundImage: `url(${ch.image})` }}
      />

      {/* background layer (flat, with gradient) */}
      <div
        className="char3d-bg"
        style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%), url(${ch.image})` }}
      />

      {/* decorative border frame (mid-depth) */}
      <div
        className="char3d-border"
        style={{
          borderColor: ch.aura,
          [borderSide === 'left' ? 'borderLeftColor' : borderSide === 'right' ? 'borderRightColor' : 'borderBottomColor']: 'transparent',
        }}
      />

      {/* cutout foreground (popped forward) */}
      <div
        className="char3d-cutout"
        style={{ backgroundImage: `url(${ch.image})` }}
      />

      {/* kanji watermark behind cutout */}
      <div className="char3d-kanji" style={{ color: ch.aura }}>
        {ch.initial}
      </div>

      {/* content (most forward) */}
      <div className="char3d-content">
        <h3 className="font-display text-base font-bold text-white drop-shadow-lg sm:text-lg md:text-2xl">
          {ch.name}
        </h3>
        <div className="mt-0.5 text-[0.6rem] uppercase tracking-[0.2em] opacity-70 sm:text-xs sm:tracking-[0.3em]" style={{ color: ch.aura }}>
          <GlitchTranslation textKey={ch.title} speed={25} />
        </div>
        <p className="mt-1 text-xs italic text-white/80 line-clamp-2 drop-shadow sm:mt-2 sm:text-sm">
          {ch.quote}
        </p>
      </div>
    </motion.div>
  )
}

/* ---------- main section ---------- */
export default function CharacterShowcase() {
  const { lang } = useLanguage()
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = window.innerWidth < 768 ? 260 : 340
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' })
  }

  return (
    <section
      id="characters"
      className="relative px-6 py-32"
      style={{
        background: 'linear-gradient(180deg, transparent, rgba(155,93,229,0.08), transparent)',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <div className="font-jp mb-2 text-sm tracking-wider text-chakra">
            キャラクター — <GlitchTranslation textKey="heroes" speed={30} />
          </div>
          <h2 className={`text-3xl sm:text-5xl md:text-6xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
            <ShatterText text={t('ICONIC', lang)} className="text-white" charClassName="inline-block" />{' '}
            <ShatterText text={t('CHARACTERS', lang)} className="gradient-shonen animate-sweep" charClassName="inline-block" delay={0.15} />
          </h2>
        </motion.div>

        {/* navigation arrows */}
        <div className="relative">
          {/* fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent md:w-24" />
          {canScrollLeft && (
            <button
              onClick={() => scroll(-1)}
              data-cursor="hover"
              className="focus-ring absolute -left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-paper/20 p-3 text-white backdrop-blur-sm transition hover:bg-paper/40 md:-left-6"
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll(1)}
              data-cursor="hover"
              className="focus-ring absolute -right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-paper/20 p-3 text-white backdrop-blur-sm transition hover:bg-paper/40 md:-right-6"
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* scrollable card row */}
          <div
            ref={scrollRef}
            className="char3d-scroll hide-scrollbar flex gap-4 overflow-x-auto overflow-y-visible px-4 pb-16 pt-4 sm:gap-6 md:gap-8"
          >
            {CHARS.map((ch, i) => (
              <Card3D key={ch.name} ch={ch} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
