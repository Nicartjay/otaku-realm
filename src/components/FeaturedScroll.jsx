import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ANIME } from '../data/anime.js'
import { ContainerScroll } from './ContainerScroll.jsx'
import { StarIcon, ArrowRightIcon } from './icons/ui.jsx'
import GlitchTranslation from './GlitchTranslation.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { t } from '../data/translations.js'

/**
 * Wraps the Aceternity ContainerScroll component with our anime data.
 * Inside the card we auto-rotate through the 6 series, each fading in
 * with its banner image + JP/EN title + accent color overlay.
 */
export default function FeaturedScroll() {
  const [i, setI] = useState(0)
  const { lang } = useLanguage()

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % ANIME.length), 4500)
    return () => clearInterval(id)
  }, [])

  const a = ANIME[i]

  return (
    <section className="relative">
      <ContainerScroll
        titleComponent={
          <>
            <div className="font-jp mb-2 text-sm tracking-[0.4em] text-sun">
              スクロールせよ — <GlitchTranslation textKey="scroll on" speed={30} />
            </div>
            <h2 className="font-display text-4xl text-white md:text-5xl">
              <GlitchTranslation textKey="Step inside the" speed={35} />
            </h2>
            <h2 className="mt-1 font-display text-5xl leading-none md:text-7xl lg:text-[6rem]">
              <span className="gradient-shonen animate-sweep">
                <GlitchTranslation textKey="ANIME REALM" speed={40} />
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 md:text-base">
              <GlitchTranslation textKey={lang === 'jp' ? 'featuredscroll_desc' : 'featuredscroll_desc_en'} speed={15} />
            </p>
          </>
        }
      >
        {/* Card content */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-ink">
          <AnimatePresence mode="wait">
            <motion.img
              key={a.slug}
              src={a.banner}
              alt={a.title}
              draggable={false}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
          </AnimatePresence>

          {/* Color accent overlay */}
          <motion.div
            key={a.slug + 'tint'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 mix-blend-color"
            style={{ background: a.accent }}
          />

          {/* Dark scrim for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

          {/* Halftone + speed lines for that anime feel */}
          <div className="halftone absolute inset-0 opacity-25 mix-blend-overlay" />
          <div className="speed-lines absolute inset-0 opacity-30 mix-blend-overlay" />

          {/* Floating big kanji */}
          <AnimatePresence mode="wait">
            <motion.span
              key={a.slug + 'jp'}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 0.18, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.7 }}
              className="font-jp pointer-events-none absolute -right-4 top-2 text-[10rem] leading-none md:text-[16rem]"
              style={{
                color: a.accent,
                textShadow: `0 0 60px ${a.accent}`,
              }}
            >
              {a.jp.charAt(0)}
            </motion.span>
          </AnimatePresence>

          {/* Title block */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={a.slug + 'meta'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="font-jp mb-2 text-sm tracking-widest md:text-base"
                  style={{ color: a.accent }}
                >
                  {a.jp} — {a.romaji || a.title}
                </div>
                <h3 className="font-display text-4xl leading-none text-white md:text-7xl">
                  <GlitchTranslation textKey={a.title} speed={45} />
                </h3>
                <p className="mt-2 max-w-md text-sm text-white/80 md:text-base">
                  {a.tag}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em]">
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-3 py-1 font-display"
                    style={{
                      borderColor: `${a.accent}77`,
                      color: a.accent,
                      background: `${a.accent}11`,
                    }}
                  >
                    <StarIcon size={14} />
                    {a.rating}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/80">
                    {a.year}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/80">
                    {a.studio}
                  </span>
                  <Link
                    to={`/anime/${a.slug}`}
                    data-cursor="hover"
                    className="focus-ring group ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2 font-display tracking-wider text-ink transition hover:scale-105"
                    style={{
                      background: a.accent,
                      boxShadow: `0 0 24px ${a.accent}`,
                    }}
                  >
                    <GlitchTranslation textKey="ENTER" speed={35} />
                    <ArrowRightIcon
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide indicators */}
          <div className="absolute right-6 top-6 z-10 flex gap-1.5">
            {ANIME.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                data-cursor="hover"
                aria-label={`Show ${s.title}`}
                aria-pressed={idx === i}
                className="focus-ring h-1.5 rounded-full transition-all"
                style={{
                  width: idx === i ? 28 : 8,
                  background:
                    idx === i ? a.accent : 'rgba(255,255,255,0.3)',
                  boxShadow: idx === i ? `0 0 10px ${a.accent}` : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </ContainerScroll>
    </section>
  )
}
