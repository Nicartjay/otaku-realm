import { motion } from 'framer-motion'

const TIMELINE = [
  {
    year: '1963',
    title: 'Astro Boy takes flight',
    text: 'Osamu Tezuka\'s Astro Boy launches the modern era of TV anime.',
    color: '#ff3b3b',
  },
  {
    year: '1988',
    title: 'Akira changes everything',
    text: 'Otomo\'s Akira proves anime can be cinema. The world takes notice.',
    color: '#ffb703',
  },
  {
    year: '1997',
    title: 'Pokémon goes global',
    text: 'Pocket Monsters becomes the gateway anime for a generation.',
    color: '#00e5ff',
  },
  {
    year: '2002',
    title: 'Naruto begins',
    text: 'Believe it. The Hidden Leaf raises a worldwide ninja army.',
    color: '#9b5de5',
  },
  {
    year: '2013',
    title: 'Walls fall in Attack on Titan',
    text: 'A new dark age of anime storytelling shakes the medium.',
    color: '#ff5ea8',
  },
  {
    year: '2020',
    title: 'Demon Slayer breaks records',
    text: 'Mugen Train becomes the highest-grossing Japanese film of all time.',
    color: '#ff3b3b',
  },
]

export default function Timeline() {
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
            歴史 — history
          </div>
          <h2 className="font-display text-5xl md:text-6xl">
            <span className="gradient-shonen animate-sweep">SAGA</span>{' '}
            <span className="text-white">OF THE MEDIUM</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* center line */}
          <div className="absolute left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-flame via-sun to-flame md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-14">
            {TIMELINE.map((t, i) => {
              const left = i % 2 === 0
              return (
                <motion.div
                  key={t.year}
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
                      background: t.color,
                      boxShadow: `0 0 18px ${t.color}, 0 0 40px ${t.color}`,
                    }}
                  />

                  <div
                    className={`rounded-2xl border border-white/10 bg-ink/60 p-6 backdrop-blur ${
                      left ? 'md:mr-12 md:text-right' : 'md:ml-12'
                    } ml-12 md:ml-0`}
                    data-cursor="hover"
                    style={{
                      boxShadow: `0 0 0 1px ${t.color}33, 0 20px 40px ${t.color}22`,
                    }}
                  >
                    <div
                      className="font-display text-4xl"
                      style={{ color: t.color }}
                    >
                      {t.year}
                    </div>
                    <h3 className="mt-1 font-display text-xl text-white">
                      {t.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/70">{t.text}</p>
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
