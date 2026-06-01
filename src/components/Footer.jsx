import { Link } from 'react-router-dom'
import { ArrowRightIcon } from './icons/ui.jsx'
import {
  InstagramIcon,
  YoutubeIcon,
  GithubIcon,
  FacebookIcon,
} from './icons/brands.jsx'
import FlipLinks from './FlipLinks.jsx'
import GlitchTranslation from './GlitchTranslation.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import GridShader from './GridShader.jsx'

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Nicartjay/otaku-realm', icon: <GithubIcon size={24} /> },
  { label: 'YouTube', href: 'https://www.youtube.com/@NicartJayDavid', icon: <YoutubeIcon size={24} /> },
  { label: 'Facebook', href: 'https://www.facebook.com/nicartjay', icon: <FacebookIcon size={24} /> },
  { label: 'Instagram', href: 'https://www.instagram.com/nicartjay', icon: <InstagramIcon size={24} /> },
]

export default function Footer() {
  const { lang } = useLanguage()

  return (
    <footer className="relative overflow-hidden">
      {/* Shader background */}
      <div className="absolute inset-0 z-0">
        <GridShader />
        {/* Dark overlay for text legibility — lighter in light mode to let inverted shader through */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/30 dark:from-black/80 dark:via-black/50 dark:to-black/70" />
      </div>

      {/* Top accent line */}
      <div className="absolute left-0 right-0 top-0 z-10 h-[2px] bg-gradient-to-r from-flame via-sun to-flame" />

      {/* Content */}
      <div className="relative z-10 px-6 pt-20 pb-10">
        <div className="mx-auto max-w-6xl">
          {/* Top: brand + nav */}
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <Link
                to="/"
                data-cursor="hover"
                className="focus-ring inline-block font-display text-3xl"
              >
                <span className="gradient-shonen animate-sweep">OTAKU REALM</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm text-white/60">
                <GlitchTranslation textKey={lang === 'jp' ? 'footer_desc' : 'footer_desc_en'} speed={18} />
              </p>
            </div>

            <div>
              <div className="font-jp mb-4 text-sm text-sun">移動 — <GlitchTranslation textKey="navigate" speed={30} /></div>
              <ul className="space-y-2 text-white/80">
                {[
                  ['Home', '/'],
                  ['Demon Slayer', '/anime/demon-slayer'],
                  ['Naruto', '/anime/naruto'],
                  ['Jujutsu Kaisen', '/anime/jujutsu-kaisen'],
                  ['Attack on Titan', '/anime/attack-on-titan'],
                ].map(([l, h]) => (
                  <li key={l}>
                    <Link
                      to={h}
                      data-cursor="hover"
                      className="focus-ring group inline-flex items-center gap-2 transition-colors hover:text-flame"
                    >
                      <ArrowRightIcon
                        size={14}
                        className="text-white/50 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-flame"
                      />
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Socials block */}
          <div className="mt-16">
            <div className="font-jp mb-6 text-sm text-chakra">
              ソーシャル — <GlitchTranslation textKey="follow" speed={30} />
            </div>
            <FlipLinks items={SOCIALS} />
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.3em] text-white/50 md:flex-row">
            <div>© {new Date().getFullYear()} Otaku Realm</div>
            <div className="font-jp tracking-widest">
              アニメは人生 — <GlitchTranslation textKey="anime is life" speed={30} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
