/**
 * Generic UI icons used across the app. Heroicons/Lucide-style line icons.
 * Standard 24x24 viewBox; size prop scales width/height. currentColor by default
 * so they pick up text-* classes from parent.
 */

const iconBase = (size, className) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
  className,
})

export function StarIcon({ size = 16, className = '', filled = true }) {
  return (
    <svg
      {...iconBase(size, className)}
      fill={filled ? 'currentColor' : 'none'}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function ArrowRightIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconBase(size, className)}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function ArrowLeftIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconBase(size, className)}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

export function ArrowUpRightIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconBase(size, className)}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

export function ChevronDownIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconBase(size, className)}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function SparkleIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconBase(size, className)} fill="currentColor" stroke="none">
      <path d="M12 0l1.6 8.4L22 10l-8.4 1.6L12 20l-1.6-8.4L2 10l8.4-1.6L12 0z" />
    </svg>
  )
}

export function CornerDownRightIcon({ size = 16, className = '' }) {
  return (
    <svg {...iconBase(size, className)}>
      <polyline points="15 10 20 15 15 20" />
      <path d="M4 4v7a4 4 0 0 0 4 4h12" />
    </svg>
  )
}

/** Filled sun with rays — used in ThemeSwitch. */
export function SunIcon({ size = 20, className = '' }) {
  return (
    <svg {...iconBase(size, className)}>
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  )
}

/** Crescent moon — used in ThemeSwitch. */
export function MoonIcon({ size = 20, className = '' }) {
  return (
    <svg {...iconBase(size, className)} fill="currentColor" stroke="currentColor" strokeWidth={1.5}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  )
}
