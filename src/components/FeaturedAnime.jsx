import { motion } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ANIME } from '../data/anime.js'
import { StarIcon, ArrowRightIcon } from './icons/ui.jsx'
import GlitchTranslation from './GlitchTranslation.jsx'

function Card({ a, i }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-py * 12).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(px * 12).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', `0deg`)
    el.style.setProperty('--ry', `0deg`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }}
    >
      <Link
        to={`/anime/${a.slug}`}
        data-cursor="hover"
        className="focus-ring block rounded-2xl"
      >
        <div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="group relative h-96 overflow-hidden rounded-2xl border border-white/10 [transform-style:preserve-3d]"
          style={{
            transform:
              'perspective(900px) rotateX(var(--rx,0)) rotateY(var(--ry,0))',
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* image */}
          <img
            src={a.cover}
            alt={a.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* color overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-30 mix-blend-color transition-opacity duration-500 group-hover:opacity-50`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

          {/* halftone */}
          <div className="halftone absolute inset-0 opacity-25 mix-blend-overlay" />

          {/* speed lines */}
          <div className="speed-lines absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-50" />

          {/* shine sweep on hover */}
          <div className="card-shine absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-sweep" />

          {/* glow follow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(220px circle at var(--mx,50%) var(--my,50%), ${a.accent}55, transparent 60%)`,
            }}
          />

          {/* big jp char */}
          <span
            className="font-jp pointer-events-none absolute -right-3 top-2 text-[7rem] leading-none text-white/15 transition-all duration-500 group-hover:text-white/40"
            style={{ transform: 'translateZ(40px)' }}
          >
            {a.jp.charAt(0)}
          </span>

          {/* rating badge */}
          <div
            className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-ink/80 px-3 py-1 font-display text-sm backdrop-blur"
            style={{ color: a.accent, boxShadow: `0 0 18px ${a.accent}55` }}
          >
            <StarIcon size={14} />
            {a.rating}
          </div>

          {/* content */}
          <div
            className="relative z-10 flex h-full flex-col justify-end p-6"
            style={{ transform: 'translateZ(50px)' }}
          >
            <div className="font-jp text-sm tracking-wider text-white/80">
              {a.jp}
            </div>
            <h3 className="font-display text-3xl text-white drop-shadow">
              <GlitchTranslation textKey={a.title} speed={35} />
            </h3>
            <p className="mt-1 text-sm text-white/70">{a.tag}</p>

            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background: a.accent,
                    boxShadow: `0 0 12px ${a.accent}`,
                  }}
                />
                {a.studio}
              </div>
              <span
                className="flex items-center gap-1"
                style={{ color: a.accent }}
              >
                <GlitchTranslation textKey="explore" speed={30} />
                <ArrowRightIcon
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </div>
          </div>

          {/* corner accents */}
          <div className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-white/80" />
          <div className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-white/80" />
          <div className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-white/80" />
          <div className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-white/80" />
        </div>
      </Link>
    </motion.div>
  )
}

export default function FeaturedAnime() {
  return (
    <section id="anime" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex items-end justify-between"
        >
          <div>
            <div className="font-jp mb-2 text-sm tracking-wider text-sun">
              注目のアニメ — <GlitchTranslation textKey="featured" speed={30} />
            </div>
            <h2 className="font-display text-5xl md:text-6xl">
              <span className="gradient-shonen animate-sweep"><GlitchTranslation textKey="LEGENDARY" speed={40} /></span>{' '}
              <span className="text-white"><GlitchTranslation textKey="SERIES" speed={40} /></span>
            </h2>
          </div>
          <div className="hidden text-xs uppercase tracking-[0.4em] text-white/50 md:block">
            <GlitchTranslation textKey="hover & click to enter" speed={25} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ANIME.map((a, i) => (
            <Card a={a} i={i} key={a.slug} />
          ))}
        </div>
      </div>
    </section>
  )
}
