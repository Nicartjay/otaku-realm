import { motion } from 'framer-motion'
import { useState } from 'react'
import { CornerDownRightIcon } from './icons/ui.jsx'
import GlitchTranslation from './GlitchTranslation.jsx'
import ShatterText from './ShatterText.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { t } from '../data/translations.js'

/**
 * Real character photos sourced from MyAnimeList CDN
 * (cdn.myanimelist.net/images/characters/...). The image IDs come from
 * the local MAL dataset in `src/data/animeMal.js`.
 */
const CHARS = [
  {
    name: 'Tanjiro Kamado',
    title: 'Demon Slayer Corps',
    aura: '#ff3b3b',
    quote: '"Set your heart ablaze."',
    initial: '炭',
    image:
      'https://cdn.myanimelist.net/images/characters/6/386735.jpg',
  },
  {
    name: 'Naruto Uzumaki',
    title: 'Hokage in Training',
    aura: '#ffb703',
    quote: '"I never go back on my word."',
    initial: 'ナ',
    image:
      'https://cdn.myanimelist.net/images/characters/2/284121.jpg',
  },
  {
    name: 'Satoru Gojo',
    title: 'The Honored One',
    aura: '#a855f7',
    quote: '"Throughout heaven and earth, I alone am the honored one."',
    initial: '悟',
    image:
      'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
  },
  {
    name: 'Izuku Midoriya',
    title: 'Symbol of Hope',
    aura: '#22d3ee',
    quote: '"Plus Ultra!"',
    initial: '出',
    image:
      'https://cdn.myanimelist.net/images/characters/7/299404.jpg',
  },
  {
    name: 'Mikasa Ackerman',
    title: 'Survey Corps Vanguard',
    aura: '#ff5ea8',
    quote: '"This world is cruel — but also very beautiful."',
    initial: '兵',
    image:
      'https://cdn.myanimelist.net/images/characters/9/215563.jpg',
  },
  {
    name: 'Monkey D. Luffy',
    title: 'Future King of the Pirates',
    aura: '#fbbf24',
    quote: '"I\'m gonna be King of the Pirates!"',
    initial: '海',
    image:
      'https://cdn.myanimelist.net/images/characters/9/310307.jpg',
  },
  {
    name: 'Son Goku',
    title: 'Saiyan Warrior',
    aura: '#f59e0b',
    quote: '"I am the hope of the universe!"',
    initial: '悟',
    image:
      'https://cdn.myanimelist.net/images/characters/15/72546.jpg',
  },
  {
    name: 'Edward Elric',
    title: 'Fullmetal Alchemist',
    aura: '#dc2626',
    quote: '"A lesson without pain is meaningless."',
    initial: '鋼',
    image:
      'https://cdn.myanimelist.net/images/characters/9/72533.jpg',
  },
  {
    name: 'Light Yagami',
    title: 'God of the New World',
    aura: '#6b21a8',
    quote: '"I am justice!"',
    initial: '月',
    image:
      'https://cdn.myanimelist.net/images/characters/6/63870.jpg',
  },
  {
    name: 'Kirito',
    title: 'Black Swordsman',
    aura: '#3b82f6',
    quote: '"There is one thing I\'ve learned here — to keep fighting."',
    initial: '剣',
    image:
      'https://cdn.myanimelist.net/images/characters/7/204821.jpg',
  },
  {
    name: 'Ken Kaneki',
    title: 'One-Eyed King',
    aura: '#ef4444',
    quote: '"What is 1000 minus 7?"',
    initial: '喰',
    image:
      'https://cdn.myanimelist.net/images/characters/15/307255.jpg',
  },
]

export default function CharacterShowcase() {
  const [active, setActive] = useState(0)
  const { lang } = useLanguage()
  const ch = CHARS[active]

  return (
    <section
      id="characters"
      className="relative px-6 py-32"
      style={{
        background:
          'linear-gradient(180deg, transparent, rgba(155,93,229,0.08), transparent)',
      }}
    >
      <div className="mx-auto max-w-6xl">
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
          <h2 className={`text-5xl md:text-6xl overflow-visible ${lang === 'jp' ? 'font-pop' : 'font-display'}`}>
            <ShatterText text={t('ICONIC', lang)} className="text-white" charClassName="inline-block" />{' '}
            <ShatterText text={t('CHARACTERS', lang)} className="gradient-shonen animate-sweep" charClassName="inline-block" delay={0.15} />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* big rotating display */}
          <div className="relative mx-auto aspect-square w-[min(420px,90vw)] max-w-full">
            {/* outer dashed spinning ring */}
            <div
              className="absolute inset-0 animate-spinSlow rounded-full border-2 border-dashed"
              style={{ borderColor: ch.aura }}
            />
            {/* inner solid ring */}
            <div
              className="absolute inset-6 rounded-full border-2 opacity-50"
              style={{ borderColor: ch.aura }}
            />
            {/* faint kanji watermark behind portrait */}
            <span
              key={ch.initial + 'kanji'}
              className="font-jp pointer-events-none absolute inset-0 flex items-center justify-center text-[12rem] leading-none opacity-15 md:text-[18rem]"
              style={{
                color: ch.aura,
                textShadow: `0 0 60px ${ch.aura}`,
              }}
            >
              {ch.initial}
            </span>

            {/* portrait — circular crop with glow */}
            <motion.div
              key={ch.name}
              initial={{ scale: 0.85, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 130, damping: 14 }}
              className="absolute inset-10 overflow-hidden rounded-full"
              style={{
                boxShadow: `0 0 50px ${ch.aura}aa, 0 0 110px ${ch.aura}55, inset 0 0 40px rgba(0,0,0,0.4)`,
                border: `3px solid ${ch.aura}`,
              }}
            >
              <img
                src={ch.image}
                alt={ch.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {/* subtle accent wash on top */}
              <div
                className="absolute inset-0 mix-blend-color opacity-20"
                style={{
                  background: `linear-gradient(180deg, transparent, ${ch.aura})`,
                }}
              />
              {/* vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>

            {/* floating sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute h-3 w-3 rounded-full"
                style={{
                  background: ch.aura,
                  boxShadow: `0 0 12px ${ch.aura}`,
                  top: `${10 + Math.random() * 80}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* info + selectors */}
          <div>
            <motion.div
              key={ch.name + 'info'}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em]"
                style={{ color: ch.aura }}
              >
                <CornerDownRightIcon size={12} /> <GlitchTranslation textKey="now featuring" speed={30} />
              </div>
              <h3 className="font-display text-5xl text-white">{ch.name}</h3>
              <div className="mt-1 text-white/60"><GlitchTranslation textKey={ch.title} speed={25} /></div>
              <p className="mt-6 max-w-md text-lg italic text-white/80">
                {ch.quote}
              </p>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-3">
              {CHARS.map((c, i) => (
                <button
                  key={c.name}
                  data-cursor="hover"
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  aria-label={`Show ${c.name}`}
                  className={`focus-ring group relative flex items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-4 font-display text-sm tracking-wider transition ${
                    active === i
                      ? 'text-ink'
                      : 'border-white/15 text-white/80 hover:border-white/50 hover:text-white'
                  }`}
                  style={
                    active === i
                      ? {
                          background: c.aura,
                          borderColor: c.aura,
                          boxShadow: `0 0 16px ${c.aura}`,
                        }
                      : {}
                  }
                >
                  <span
                    className="block h-8 w-8 overflow-hidden rounded-full"
                    style={{
                      border: `1.5px solid ${active === i ? '#08020f' : c.aura}`,
                      boxShadow:
                        active === i ? 'none' : `0 0 8px ${c.aura}66`,
                    }}
                  >
                    <img
                      src={c.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </span>
                  {c.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
