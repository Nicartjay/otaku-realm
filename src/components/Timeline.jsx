import { motion } from 'framer-motion'
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
  },
  {
    year: '1988',
    titleKey: 'Akira changes everything',
    textKey: 'Akira timeline',
    color: '#ffb703',
  },
  {
    year: '1997',
    titleKey: 'Pokémon goes global',
    textKey: 'Pokemon timeline',
    color: '#00e5ff',
  },
  {
    year: '2002',
    titleKey: 'Naruto begins',
    textKey: 'Naruto timeline',
    color: '#9b5de5',
  },
  {
    year: '2013',
    titleKey: 'Walls fall in Attack on Titan',
    textKey: 'AoT timeline',
    color: '#ff5ea8',
  },
  {
    year: '2020',
    titleKey: 'Demon Slayer breaks records',
    textKey: 'DS timeline',
    color: '#ff3b3b',
  },
]

export default function Timeline() {
  const { lang } = useLanguage()

  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="font-jp mb-2 text-sm tracking-wider text-sakura">
            歴史 — <GlitchTranslation textKey="history" speed={30} />
          </div>
          <h2 className={`text-5xl md:text-6xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
            <ShatterText text={tr('SAGA', lang)} className="gradient-shonen animate-sweep" charClassName="inline-block" />{' '}
            <ShatterText text={tr('OF THE MEDIUM', lang)} className="text-white" charClassName="inline-block" delay={0.1} />
          </h2>
        </motion.div>

        <div className="relative">
          {/* center line */}
          <div className="absolute left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-flame via-sun to-flame md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-14">
            {TIMELINE.map((item, i) => {
              const left = i % 2 === 0
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: left ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`relative grid items-center gap-6 md:grid-cols-2 ${
                    left ? '' : 'md:[&>*:first-child]:order-2'
                  }`}
                >
                  {/* dot */}
                  <span
                    className="absolute left-4 top-6 z-10 h-4 w-4 -translate-x-1/2 rounded-full md:left-1/2"
                    style={{
                      background: item.color,
                      boxShadow: `0 0 18px ${item.color}, 0 0 40px ${item.color}`,
                    }}
                  />

                  <div
                    className={`rounded-2xl border border-white/10 bg-ink/60 p-6 backdrop-blur ${
                      left ? 'md:mr-12 md:text-right' : 'md:ml-12'
                    } ml-12 md:ml-0`}
                    data-cursor="hover"
                    style={{
                      boxShadow: `0 0 0 1px ${item.color}33, 0 20px 40px ${item.color}22`,
                    }}
                  >
                    <div
                      className="font-display text-4xl"
                      style={{ color: item.color }}
                    >
                      {item.year}
                    </div>
                    <h3 className="mt-1 font-display text-xl text-white">
                      <GlitchTranslation textKey={item.titleKey} speed={30} />
                    </h3>
                    <p className="mt-2 text-sm text-white/70">
                      <GlitchTranslation textKey={item.textKey} speed={18} />
                    </p>
                  </div>

                  {/* spacer to keep grid balanced */}
                  <div className="hidden md:block" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
