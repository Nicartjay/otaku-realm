import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import GlitchTranslation from './GlitchTranslation.jsx'
import ShatterText from './ShatterText.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { t } from '../data/translations.js'

const QUOTES = [
  {
    text: 'People\'s lives don\'t end when they die. It ends when they lose faith.',
    by: 'Itachi Uchiha',
    show: 'Naruto',
    color: '#ff3b3b',
  },
  {
    text: 'If you don\'t take risks, you can\'t create a future.',
    by: 'Monkey D. Luffy',
    show: 'One Piece',
    color: '#ffb703',
  },
  {
    text: 'Power comes in response to a need, not a desire.',
    by: 'Goku',
    show: 'Dragon Ball Z',
    color: '#00e5ff',
  },
  {
    text: 'Hard work is worthless for those that don\'t believe in themselves.',
    by: 'Naruto Uzumaki',
    show: 'Naruto',
    color: '#9b5de5',
  },
  {
    text: 'A lesson without pain is meaningless.',
    by: 'Edward Elric',
    show: 'Fullmetal Alchemist',
    color: '#ff5ea8',
  },
]

export default function QuotesCarousel() {
  const [i, setI] = useState(0)
  const { lang } = useLanguage()

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % QUOTES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const q = QUOTES[i]

  return (
    <section id="quotes" className="relative overflow-hidden px-6 py-32">
      {/* Flame heat-haze. Two radial blobs slowly breathe in opposite
          phases, suggesting heat without the rainbow spin. */}
      <motion.div
        animate={{ opacity: [0.18, 0.32, 0.18], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-40 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,45,85,0.55) 0%, rgba(255,138,60,0.25) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        animate={{ opacity: [0.32, 0.18, 0.32], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-40 top-1/3 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,201,60,0.45) 0%, rgba(255,45,85,0.2) 45%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <div className="font-jp mb-2 text-sm tracking-wider text-sun">
          名言 — <GlitchTranslation textKey="words of power" speed={30} />
        </div>
        <h2 className={`mb-12 text-5xl md:text-6xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
          <ShatterText text={t('ECHOES OF', lang)} className="text-white" charClassName="inline-block" />{' '}
          <ShatterText text={t('LEGENDS', lang)} className="gradient-shonen animate-sweep" charClassName="inline-block" delay={0.15} />
        </h2>

        <div className="relative min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl border border-white/10 bg-ink/60 p-10 backdrop-blur"
              style={{
                boxShadow: `0 0 0 2px ${q.color}55, 0 30px 80px ${q.color}33`,
              }}
            >
              <span
                className="absolute -left-4 -top-10 font-display text-9xl"
                style={{ color: q.color, textShadow: `0 0 20px ${q.color}` }}
              >
                "
              </span>
              <p className="text-2xl text-white md:text-3xl">{q.text}</p>
              <div className="mt-6 text-white/70">
                <span className="font-display text-xl" style={{ color: q.color }}>
                  {q.by}
                </span>
                <span className="ml-2 text-sm">— {q.show}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {QUOTES.map((qq, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              data-cursor="hover"
              aria-label={`Show quote by ${qq.by}`}
              aria-pressed={idx === i}
              className="focus-ring h-2 rounded-full transition-all"
              style={{
                width: idx === i ? 32 : 10,
                background: idx === i ? qq.color : 'rgba(255,255,255,0.2)',
                boxShadow: idx === i ? `0 0 12px ${qq.color}` : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
