import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/**
 * Letter-by-letter flip-up hover animation for a list of links.
 *
 * - Each link renders two stacked rows of letters; on hover the top row
 *   slides up and the duplicate row slides into place, with a small
 *   per-letter delay so the effect "rolls" left-to-right.
 * - Top row uses the project's anime gradient (`gradient-shonen` +
 *   `animate-sweep`); duplicate row is solid `flame` so the swap reads
 *   as a color flash.
 * - Adapted from a stock shadcn/Aceternity-style snippet to match the
 *   project's plain Vite + JSX + Tailwind conventions:
 *   no TS, no `@/components/ui/...` alias, no shadcn tokens.
 *
 * Props:
 *   - href:        string        — required. external URLs open in new tab.
 *   - children:    string        — the visible label. MUST be a string so
 *                                  we can split into letters.
 *   - icon:        ReactNode     — optional leading SVG (brand glyph).
 *   - aria-label:  string        — optional override for screen readers
 *                                  when `children` already conveys the link.
 */
function FlipLink({ href, children, icon, ...rest }) {
  const reduce = usePrefersReducedMotion()

  // Guard: split() would explode on non-strings.
  if (typeof children !== 'string') {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('FlipLink expects a string child. Received:', children)
    }
    return null
  }

  const letters = children.split('')
  const isExternal = /^https?:\/\//.test(href)

  // Reduced-motion fallback: render a plain link with the gradient-on-hover
  // treatment, no flip animation, no transition delays. Per project rule
  // (m0200) we ADD the static fallback rather than removing animation
  // for default users.
  if (reduce) {
    return (
      <a
        href={href}
        data-cursor="hover"
        aria-label={rest['aria-label']}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="focus-ring group inline-flex items-center gap-3 whitespace-nowrap font-display text-2xl uppercase tracking-wider text-white transition-colors hover:text-flame sm:text-3xl md:text-4xl lg:text-5xl"
        style={{ lineHeight: 0.85 }}
      >
        {icon ? <span className="shrink-0 text-white/70">{icon}</span> : null}
        <span className="gradient-shonen animate-sweep">{children}</span>
      </a>
    )
  }

  return (
    <a
      href={href}
      data-cursor="hover"
      aria-label={rest['aria-label']}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="focus-ring group relative inline-flex items-center gap-3 overflow-hidden whitespace-nowrap font-display text-2xl uppercase tracking-wider text-white sm:text-3xl md:text-4xl lg:text-5xl"
      style={{ lineHeight: 0.85 }}
    >
      {icon ? (
        <span className="shrink-0 text-white/70 transition-colors duration-300 group-hover:text-flame">
          {icon}
        </span>
      ) : null}

      {/* Letter stack — two parallel rows, the duplicate is offset
          by 110% so the slide-in feels like a continuous roll. */}
      <span className="relative inline-block">
        {/* Top row — anime gradient. Slides UP on hover. */}
        <span className="flex">
          {letters.map((letter, i) => (
            <span
              key={`t-${i}`}
              className="gradient-shonen animate-sweep inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {letter === ' ' ? '\u00a0' : letter}
            </span>
          ))}
        </span>

        {/* Duplicate row — solid flame. Slides UP into place from below. */}
        <span aria-hidden="true" className="absolute inset-0 flex">
          {letters.map((letter, i) => (
            <span
              key={`b-${i}`}
              className="inline-block translate-y-[110%] text-flame transition-transform duration-300 ease-in-out group-hover:translate-y-0"
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {letter === ' ' ? '\u00a0' : letter}
            </span>
          ))}
        </span>
      </span>
    </a>
  )
}

/**
 * Vertical stack of flip-letter links. Default props match the existing
 * site socials so this drops cleanly into Footer.
 */
export default function FlipLinks({ items = [], className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {items.map((it) => (
        <FlipLink
          key={it.label}
          href={it.href}
          icon={it.icon}
          aria-label={it.ariaLabel}
        >
          {it.label}
        </FlipLink>
      ))}
    </div>
  )
}

export { FlipLink }
