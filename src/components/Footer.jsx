import { Link } from 'react-router-dom'
import { ArrowRightIcon } from './icons/ui.jsx'
import {
  TwitterXIcon,
  InstagramIcon,
  YoutubeIcon,
  DiscordIcon,
  GithubIcon,
} from './icons/brands.jsx'
import FlipLinks from './FlipLinks.jsx'

/**
 * Social rows for the FlipLinks block. Each entry pairs a brand glyph
 * with the label that gets the letter-by-letter flip treatment.
 * Icon size is fixed (44px) — sits comfortably between the smallest
 * (text-4xl ~ 36px) and largest (text-8xl ~ 96px) link sizes without
 * dominating either end. Note: brand icons set width/height as SVG
 * attributes which take precedence over CSS, so size has to be a number.
 */
const SOCIALS = [
  { label: 'Twitter', href: '#', icon: <TwitterXIcon size={44} /> },
  { label: 'Instagram', href: '#', icon: <InstagramIcon size={44} /> },
  { label: 'YouTube', href: '#', icon: <YoutubeIcon size={44} /> },
  { label: 'Discord', href: '#', icon: <DiscordIcon size={44} /> },
  { label: 'GitHub', href: '#', icon: <GithubIcon size={44} /> },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-6 pt-20 pb-10">
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-flame via-sun to-flame" />

      <div className="mx-auto max-w-6xl">
        {/* Top: brand + nav (2-col so they sit side by side and leave the
            full width below for the oversize FlipLinks) */}
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
              A love letter to anime — animated, interactive, alive. Crafted
              with React + Framer Motion.
            </p>
          </div>

          <div>
            <div className="font-jp mb-4 text-sm text-sun">移動 — navigate</div>
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

        {/* Socials block — oversize FlipLinks row spanning full width */}
        <div className="mt-16">
          <div className="font-jp mb-6 text-sm text-chakra">
            ソーシャル — follow
          </div>
          <FlipLinks items={SOCIALS} />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.3em] text-white/50 md:flex-row">
          <div>© {new Date().getFullYear()} Otaku Realm</div>
          <div className="font-jp tracking-widest">
            アニメは人生 — anime is life
          </div>
        </div>
      </div>
    </footer>
  )
}
