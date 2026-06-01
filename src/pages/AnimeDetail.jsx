import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ANIME, getAnime } from '../data/anime.js'
import { getMal } from '../data/animeMal.js'
import GlitchTranslation from '../components/GlitchTranslation.jsx'
import ShatterText from '../components/ShatterText.jsx'
import ThemeMotif from '../components/ThemeMotif.jsx'
import MagneticButton from '../components/MagneticButton.jsx'
import {
  StarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from '../components/icons/ui.jsx'
import {
  buildCursorThemeFromAnime,
  useCursorTheme,
} from '../context/CursorThemeContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { t as tr } from '../data/translations.js'
import useTheme from '../hooks/useTheme.js'

/**
 * Per-anime detail page. Look is heavily driven by `anime.theme`:
 *   theme.bg          — page-level background gradient
 *   theme.grad        — accent linear-gradient used on titles & dividers
 *   theme.kanji       — large floating kanji glyph
 *   theme.kanjiLabel  — small caption beneath the kanji
 *   theme.tagline     — tagline shown above the title
 *   theme.id          — chooses which decorative motif layer to render
 *
 * Banner image is an HD landscape (1920w from Unsplash). It scales +
 * shifts on scroll for parallax. Page background uses theme.bg so the
 * mood persists below the fold.
 */
export default function AnimeDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const anime = getAnime(slug)
  const ref = useRef(null)
  const [activeImg, setActiveImg] = useState(0)
  const { setTheme, resetTheme } = useCursorTheme()
  const themeMode = useTheme()
  const { lang } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Apply per-anime cursor palette while this page is mounted.
  // Reset to default theme on unmount or when slug changes to an
  // unknown anime (404 path).
  useEffect(() => {
    if (!anime) {
      resetTheme()
      return
    }
    setTheme(buildCursorThemeFromAnime(anime))
    return () => {
      resetTheme()
    }
  }, [anime, setTheme, resetTheme])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacityBg = useTransform(scrollYProgress, [0, 0.6], [1, 0.3])
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const titleY = useTransform(scrollYProgress, [0, 0.6], [0, -60])

  if (!anime) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pt-24 text-center">
        <h1 className="font-display text-6xl text-flame">404</h1>
        <p className="text-white/70">That anime drifted into another realm.</p>
        <Link
          to="/"
          data-cursor="hover"
          className="focus-ring inline-flex items-center gap-2 rounded-full border-2 border-sun px-6 py-2 font-display tracking-wider text-sun"
        >
          <ArrowLeftIcon size={14} /> Return Home
        </Link>
      </div>
    )
  }

  const t = anime.theme
  const otherAnime = ANIME.filter((a) => a.slug !== anime.slug).slice(0, 3)
  const mal = getMal(slug)

  // In light mode, swap the page-level background away from the dark
  // radial gradient (`t.bg`) to a soft cream tinted with the anime's
  // accent color. The motif overlay below also fades out so the page
  // reads as a clean light surface with a subtle anime hue.
  const isLight = themeMode === 'light'
  const pageBackground = isLight
    ? `radial-gradient(ellipse at 50% 0%, ${anime.accent}1f 0%, transparent 55%), #fbf6ec`
    : t.bg

  return (
    <div
      ref={ref}
      className="relative"
      style={{ background: pageBackground }}
    >
      {/* per-show motif overlay (dimmed in light mode so it reads as a
          subtle accent rather than dark atmosphere). */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{ opacity: isLight ? 0.25 : 1 }}
      >
        <ThemeMotif theme={t} />
      </div>

      {/* ── Cinematic landscape banner ─────────────────── */}
      <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
        <motion.div
          style={{ y: yBg, scale: scaleBg, opacity: opacityBg }}
          className="absolute inset-0"
        >
          <img
            src={anime.banner}
            alt={anime.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Theme color tint over banner */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${anime.accent}33 0%, transparent 30%, transparent 60%, #08020fee 100%)`,
              mixBlendMode: 'multiply',
            }}
          />
          {/* film grain */}
          <div className="noise absolute inset-0 opacity-30" />
        </motion.div>

        {/* dark scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <div className="halftone absolute inset-0 opacity-20 mix-blend-overlay" />
        <div className="speed-lines absolute inset-0 opacity-25 mix-blend-overlay" />

        {/* back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute left-6 top-24 z-20 md:left-10"
        >
          <MagneticButton
            onClick={() => navigate(-1)}
            strength={12}
            tilt={6}
            glowColor="rgba(255,201,60,0.35)"
            className="rounded-full border border-white/20 bg-ink/60 px-4 py-2 font-display text-sm tracking-wider text-white backdrop-blur hover:border-sun hover:text-sun"
          >
            <ArrowLeftIcon size={14} />
            <GlitchTranslation textKey="BACK" speed={35} />
          </MagneticButton>
        </motion.div>

        {/* big floating kanji */}
        <motion.span
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 0.22, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2 }}
          className="font-jp pointer-events-none absolute -right-8 top-12 z-10 text-[12rem] leading-none md:text-[18rem] lg:text-[22rem]"
          style={{
            color: anime.accent,
            textShadow: `0 0 90px ${anime.accent}`,
            WebkitTextStroke: `1px rgba(255,255,255,0.05)`,
          }}
        >
          {t.kanji}
        </motion.span>

        {/* title block */}
        <motion.div
          style={{ y: titleY }}
          className="absolute inset-x-0 bottom-0 z-10 px-6 pb-16 md:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-jp mb-3 text-base tracking-widest"
              style={{ color: anime.accent }}
            >
              {anime.jp} — {anime.romaji}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={`text-6xl leading-none md:text-8xl ${lang === 'jp' ? 'font-pop font-bold' : 'font-display'}`}
            >
              <span className="text-white">
                <GlitchTranslation textKey={anime.title} speed={50} className="inline" />
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-3 inline-block font-display text-lg italic"
              style={{
                background: t.grad,
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              "{t.tagline}"
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-6 flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/80"
            >
              <span
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-display"
                style={{
                  background: `${anime.accent}22`,
                  color: anime.accent,
                  border: `1px solid ${anime.accent}55`,
                }}
              >
                <StarIcon size={14} /> {anime.rating}
              </span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">
                {anime.year}
              </span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">
                {anime.studio}
              </span>
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">
                {anime.episodes}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* bottom themed divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: t.grad }}
        />
      </section>

      {/* ── Body ─────────────────────────────────── */}
      <section className="relative z-10 px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div
              className="font-jp mb-2 text-sm tracking-wider"
              style={{ color: anime.accent }}
            >
              あらすじ — <GlitchTranslation textKey="synopsis" speed={30} />
            </div>
            <h2 className={`mb-6 text-4xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
              <ShatterText
                text={tr('THE STORY', lang)}
                charClassName="inline-block animate-sweep"
                charStyle={{
                  background: t.grad,
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              />
            </h2>
            <p
              data-cursor="text"
              className="text-lg leading-relaxed text-white/85"
            >
              {anime.synopsis}
            </p>

            <div className="mt-8">
              <div className="mb-3 text-xs uppercase tracking-[0.4em] text-white/50">
                <GlitchTranslation textKey="Genres" speed={30} />
              </div>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((g) => (
                  <span
                    key={g}
                    data-cursor="hover"
                    className="focus-ring rounded-full border px-4 py-1.5 font-display text-sm tracking-wider transition hover:scale-105"
                    style={{
                      borderColor: `${anime.accent}66`,
                      color: anime.accentSoft,
                      boxShadow: `inset 0 0 20px ${anime.accent}11`,
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Themed quote callout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 rounded-2xl border border-white/10 p-6 backdrop-blur"
              style={{
                background: `linear-gradient(135deg, ${anime.accent}11, transparent)`,
                boxShadow: `0 0 0 1px ${anime.accent}44, 0 20px 40px ${anime.accent}22`,
              }}
            >
              <div
                className="font-jp text-7xl leading-none"
                style={{ color: anime.accent, textShadow: `0 0 30px ${anime.accent}` }}
              >
                "
              </div>
              <p
                className="-mt-6 ml-12 font-display text-2xl italic md:text-3xl"
                style={{ color: anime.accentSoft }}
              >
                {t.tagline}
              </p>
              <div className="mt-3 ml-12 text-xs uppercase tracking-[0.4em] text-white/50">
                — {t.kanjiLabel}
              </div>
            </motion.div>
          </motion.div>

          {/* Stats panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative h-fit overflow-hidden rounded-2xl border border-white/10 bg-ink/60 p-6 backdrop-blur"
            style={{ boxShadow: `0 20px 60px ${anime.accent}22` }}
          >
            {/* themed corner glyph */}
            <span
              className="font-jp pointer-events-none absolute -right-4 -top-6 text-[8rem] leading-none opacity-10"
              style={{ color: anime.accent }}
            >
              {t.kanji}
            </span>

            <div className="font-jp mb-2 text-sm" style={{ color: anime.accent }}>
              情報 — <GlitchTranslation textKey="info" speed={30} />
            </div>
            <h3 className="mb-6 font-display text-2xl"><GlitchTranslation textKey="QUICK STATS" speed={35} /></h3>

            <ul className="space-y-4">
              {[
                [tr('Released', lang), anime.year],
                [tr('Studio', lang), anime.studio],
                [tr('Episodes', lang), anime.episodes],
                [
                  tr('Rating', lang),
                  <span key="rating" className="inline-flex items-center gap-1">
                    <StarIcon size={14} /> {anime.rating} / 10
                  </span>,
                ],
              ].map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-center justify-between border-b border-white/10 pb-3"
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {k}
                  </span>
                  <span className="font-display text-lg text-white">{v}</span>
                </li>
              ))}
            </ul>

            <div
              className="mt-6 h-1 w-full rounded-full"
              style={{ background: t.grad }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── MAL Information panel ────────────────────── */}
      {mal && (
        <section className="relative z-10 px-6 pb-20 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div
                className="font-jp mb-2 text-sm tracking-wider"
                style={{ color: anime.accent }}
              >
                情報 — <GlitchTranslation textKey="information" speed={30} />
              </div>
              <h2 className={`text-4xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
                <ShatterText text={tr('SERIES', lang)} className="text-white" charClassName="inline-block" />{' '}
                <ShatterText
                  text={tr('DETAILS', lang)}
                  charClassName="inline-block animate-sweep"
                  charStyle={{
                    background: t.grad,
                    backgroundSize: '300% 300%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                  delay={0.15}
                />
              </h2>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[
                [tr('Type', lang), mal.info.type],
                [tr('Episodes', lang), mal.info.episodes ?? 'Ongoing'],
                [tr('Status', lang), mal.info.status],
                [tr('Aired', lang), mal.info.aired],
                [tr('Season', lang), mal.info.season],
                [tr('Duration', lang), mal.info.duration],
                [tr('Rating', lang), mal.info.rating],
                [tr('Source', lang), mal.info.source],
                [
                  tr('MAL Score', lang),
                  <span key="malscore" className="inline-flex items-center gap-1">
                    <StarIcon size={14} /> {mal.info.score}
                  </span>,
                ],
                [tr('Scored By', lang), mal.info.scoredBy?.toLocaleString()],
                [tr('Rank', lang), `#${mal.info.rank}`],
                [tr('Popularity', lang), `#${mal.info.popularity}`],
                [tr('Members', lang), mal.info.members?.toLocaleString()],
                [tr('Favorites', lang), mal.info.favorites?.toLocaleString()],
              ].map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="rounded-xl border border-white/10 bg-ink/50 p-4 backdrop-blur"
                  style={{
                    boxShadow: `inset 0 0 30px ${anime.accent}08`,
                  }}
                >
                  <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">
                    {k}
                  </div>
                  <div
                    className="mt-1 font-display text-base"
                    style={{ color: anime.accentSoft }}
                  >
                    {v || '—'}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Production credits */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                [tr('Studios', lang), mal.info.studios],
                [tr('Producers', lang), mal.info.producers],
                [tr('Licensors', lang), mal.info.licensors],
              ].map(([label, list], i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <div className="font-jp mb-3 text-xs tracking-wider text-white/50">
                    {label}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(list || []).map((n) => (
                      <span
                        key={n}
                        data-cursor="hover"
                        className="focus-ring rounded-full border px-3 py-1 text-xs uppercase tracking-wider transition hover:scale-105"
                        style={{
                          borderColor: `${anime.accent}55`,
                          color: anime.accentSoft,
                        }}
                      >
                        {n}
                      </span>
                    ))}
                    {(!list || list.length === 0) && (
                      <span className="text-xs text-white/40">—</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Themes & Demographics */}
            {(mal.info.themes?.length > 0 || mal.info.demographics?.length > 0) && (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {mal.info.themes?.length > 0 && (
                  <div>
                    <div className="font-jp mb-3 text-xs tracking-wider text-white/50">
                      <GlitchTranslation textKey="Themes" speed={30} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mal.info.themes.map((th) => (
                        <span
                          key={th}
                          className="rounded-full px-3 py-1 font-display text-xs tracking-wider"
                          style={{
                            background: `${anime.accent}22`,
                            color: anime.accentSoft,
                          }}
                        >
                          {th}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {mal.info.demographics?.length > 0 && (
                  <div>
                    <div className="font-jp mb-3 text-xs tracking-wider text-white/50">
                      <GlitchTranslation textKey="Demographics" speed={30} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mal.info.demographics.map((d) => (
                        <span
                          key={d}
                          className="rounded-full px-3 py-1 font-display text-xs tracking-wider"
                          style={{
                            background: `${anime.accent}22`,
                            color: anime.accentSoft,
                          }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Characters & Voice Actors ─────────────── */}
      {mal?.characters?.length > 0 && (
        <section className="relative z-10 px-6 pb-20 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div
                className="font-jp mb-2 text-sm tracking-wider"
                style={{ color: anime.accent }}
              >
                登場人物 — <GlitchTranslation textKey="characters" speed={30} />
              </div>
              <h2 className={`text-4xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
                <ShatterText text={tr('CAST &', lang)} className="text-white" charClassName="inline-block" />{' '}
                <ShatterText
                  text={tr('VOICES', lang)}
                  charClassName="inline-block animate-sweep"
                  charStyle={{
                    background: t.grad,
                    backgroundSize: '300% 300%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                  delay={0.15}
                />
              </h2>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {mal.characters.map((c, i) => (
                <motion.a
                  key={c.malUrl}
                  href={c.malUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.45 }}
                  whileHover={{ y: -6 }}
                  className="focus-ring group relative block overflow-hidden rounded-xl border border-white/10 bg-ink/50 backdrop-blur transition"
                  style={{
                    boxShadow: `0 10px 30px ${anime.accent}11`,
                  }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                    <div
                      className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-display uppercase tracking-widest"
                      style={{
                        background:
                          c.role === 'Main' ? anime.accent : 'rgba(255,255,255,0.1)',
                        color: c.role === 'Main' ? '#08020f' : 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {c.role}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="font-display text-base text-white">
                      {c.name}
                    </div>

                    {c.voiceActors?.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                        {c.voiceActors.slice(0, 2).map((va) => (
                          <div
                            key={va.name + va.language}
                            className="flex items-center gap-2"
                          >
                            <img
                              src={va.image}
                              alt={va.name}
                              loading="lazy"
                              className="h-7 w-7 rounded-full border object-cover"
                              style={{ borderColor: `${anime.accent}66` }}
                            />
                            <div className="min-w-0">
                              <div className="truncate text-xs text-white/85">
                                {va.name}
                              </div>
                              <div
                                className="text-[10px] uppercase tracking-widest"
                                style={{ color: anime.accentSoft }}
                              >
                                {va.language}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Openings & Endings ────────────────────── */}
      {mal && (mal.openings?.length > 0 || mal.endings?.length > 0) && (
        <section className="relative z-10 px-6 pb-20 md:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div
                className="font-jp mb-2 text-sm tracking-wider"
                style={{ color: anime.accent }}
              >
                主題歌 — <GlitchTranslation textKey="soundtrack" speed={30} />
              </div>
              <h2 className={`text-4xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
                <ShatterText text={tr('OPENINGS &', lang)} className="text-white" charClassName="inline-block" />{' '}
                <ShatterText
                  text={tr('ENDINGS', lang)}
                  charClassName="inline-block animate-sweep"
                  charStyle={{
                    background: t.grad,
                    backgroundSize: '300% 300%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                  delay={0.2}
                />
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {[
                ['OP', tr('Openings', lang), mal.openings],
                ['ED', tr('Endings', lang), mal.endings],
              ].map(([code, label, list]) => (
                <div key={code}>
                  <div
                    className="mb-4 flex items-baseline gap-3 border-b pb-2"
                    style={{ borderColor: `${anime.accent}55` }}
                  >
                    <span
                      className="font-display text-3xl"
                      style={{ color: anime.accent }}
                    >
                      {code}
                    </span>
                    <span className="text-xs uppercase tracking-[0.4em] text-white/50">
                      {label} · {list?.length || 0}
                    </span>
                  </div>
                  <ol className="space-y-2 text-sm leading-relaxed text-white/80">
                    {(list || []).slice(0, 12).map((song, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className="font-mono text-xs"
                          style={{ color: anime.accentSoft }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1">{song}</span>
                      </li>
                    ))}
                    {list?.length > 12 && (
                      <li className="ml-7 text-xs text-white/40">
                        + {list.length - 12} more...
                      </li>
                    )}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Background note ────────────────────────── */}
      {mal?.background && (
        <section className="relative z-10 px-6 pb-20 md:px-10">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/10 p-8 backdrop-blur"
              style={{
                background: `linear-gradient(135deg, ${anime.accent}11, transparent)`,
                boxShadow: `inset 0 0 60px ${anime.accent}11`,
              }}
            >
              <div
                className="font-jp mb-2 text-sm tracking-wider"
                style={{ color: anime.accent }}
              >
                豆知識 — <GlitchTranslation textKey="production note" speed={30} />
              </div>
              <p className="text-sm leading-relaxed text-white/70 md:text-base">
                {mal.background}
              </p>
              {mal.malUrl && (
                <a
                  href={mal.malUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="focus-ring group mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] transition-colors"
                  style={{ color: anime.accent }}
                >
                  <GlitchTranslation textKey="view on myanimelist" speed={25} />
                  <ArrowUpRightIcon
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Atmospheric gallery ────────────────────── */}
      <section className="relative z-10 px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div
              className="font-jp mb-2 text-sm tracking-wider"
              style={{ color: anime.accent }}
            >
              ギャラリー — <GlitchTranslation textKey="atmosphere" speed={30} />
            </div>
            <h2 className={`text-4xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
              <ShatterText text={tr('VISUAL', lang)} className="text-white" charClassName="inline-block" />{' '}
              <ShatterText
                text={tr('MOMENTS', lang)}
                charClassName="inline-block animate-sweep"
                charStyle={{
                  background: t.grad,
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
                delay={0.15}
              />
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {anime.galleryHd.map((src, i) => (
              <motion.button
                key={i}
                type="button"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                onClick={() => setActiveImg(i)}
                aria-pressed={activeImg === i}
                aria-label={`Show gallery image ${i + 1}`}
                data-cursor="hover"
                className={`focus-ring group relative cursor-none overflow-hidden rounded-xl border-2 text-left transition-all ${
                  activeImg === i ? '' : 'border-white/10'
                }`}
                style={
                  activeImg === i
                    ? {
                        borderColor: anime.accent,
                        boxShadow: `0 0 30px ${anime.accent}66`,
                      }
                    : {}
                }
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                <div
                  className="absolute inset-0 opacity-30 mix-blend-color"
                  style={{
                    background: `linear-gradient(135deg, ${anime.accent}, transparent)`,
                  }}
                />
                <div
                  className="absolute bottom-3 left-3 font-display text-xl"
                  style={{
                    color: anime.accent,
                    textShadow: `0 0 12px ${anime.accent}`,
                  }}
                >
                  0{i + 1}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other anime ────────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="font-jp mb-2 text-sm tracking-wider text-sun">
              もっと見る — <GlitchTranslation textKey="more" speed={30} />
            </div>
            <h2 className={`text-4xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
              <ShatterText text={tr('OTHER', lang)} className="text-white" charClassName="inline-block" />{' '}
              <ShatterText text={tr('EPICS', lang)} className="gradient-shonen animate-sweep" charClassName="inline-block" delay={0.1} />
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {otherAnime.map((a, i) => (
              <motion.div
                key={a.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/anime/${a.slug}`}
                  data-cursor="hover"
                  className="focus-ring group relative block h-64 overflow-hidden rounded-xl border border-white/10"
                >
                  <img
                    src={a.cover}
                    alt={a.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="font-jp text-xs text-white/70">{a.jp}</div>
                    <div className="font-display text-2xl text-white">
                      <GlitchTranslation textKey={a.title} speed={35} />
                    </div>
                    <div
                      className="mt-1 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em]"
                      style={{ color: a.accent }}
                    >
                      <GlitchTranslation textKey="explore" speed={30} />
                      <ArrowRightIcon
                        size={12}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
