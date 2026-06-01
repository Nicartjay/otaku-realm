import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getIconByThemeId } from '../components/cursorIcons/index.jsx'

/**
 * CursorTheme — global theme palette for the custom cursor.
 *
 * Default theme = the original site palette (flame / sun / chakra).
 * Routes (e.g. AnimeDetail) call `setTheme(...)` on mount to apply
 * a per-anime palette and `resetTheme()` on unmount.
 *
 * A `theme` shape:
 *   {
 *     default:  '#hex',  // ring color when idle
 *     hover:    '#hex',  // ring color on hover targets
 *     link:     '#hex',  // ring color on links / interactive
 *     trail:    [color1..color5], // particle hues (radial-gradients)
 *     ripple:   [borderA, borderB], // click ripple borders
 *     dotHover: '#hex',
 *     dotLink:  '#hex',
 *   }
 */

const DEFAULT_THEME = {
  default: '#ff2d55', // flame
  hover: '#ffc93c', // sun
  link: '#22d3ee', // chakra
  text: '#22d3ee',
  trail: [
    'radial-gradient(circle, #ffc93c 0%, transparent 70%)',
    'radial-gradient(circle, #ff2d55 0%, transparent 70%)',
    'radial-gradient(circle, #22d3ee 0%, transparent 70%)',
    'radial-gradient(circle, #a855f7 0%, transparent 70%)',
    'radial-gradient(circle, #ff5ea8 0%, transparent 70%)',
  ],
  ripple: ['#ff2d55', '#ffc93c'],
  dotHover: '#ffc93c',
  dotLink: '#22d3ee',
  icon: null,        // optional component (color, size) => SVG
  iconColor: null,   // override; defaults to `default` color
}

const CursorThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  resetTheme: () => {},
})

export function CursorThemeProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME)

  const setTheme = useCallback((next) => {
    // Allow partial overrides; merge with defaults so callers can
    // pass just `{default, hover, link, trail}` without re-spec'ing
    // every key.
    setThemeState((prev) => ({ ...DEFAULT_THEME, ...prev, ...next }))
  }, [])

  const resetTheme = useCallback(() => {
    setThemeState(DEFAULT_THEME)
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, resetTheme }),
    [theme, setTheme, resetTheme]
  )

  return (
    <CursorThemeContext.Provider value={value}>
      {children}
    </CursorThemeContext.Provider>
  )
}

export function useCursorTheme() {
  return useContext(CursorThemeContext)
}

/**
 * Build a cursor theme from an anime's theme block + accents.
 * Used by AnimeDetail and anywhere else that wants to derive a
 * cursor palette from anime data.
 */
export function buildCursorThemeFromAnime(anime) {
  if (!anime) return DEFAULT_THEME
  const a = anime.accent || DEFAULT_THEME.default
  const aSoft = anime.accentSoft || a

  // Ring/dot colors
  const def = a
  const hover = aSoft
  const link = aSoft

  // Trail picks colors from the show palette family.
  // Falls back to default trail palette when no extras available.
  const trail = [
    `radial-gradient(circle, ${a} 0%, transparent 70%)`,
    `radial-gradient(circle, ${aSoft} 0%, transparent 70%)`,
    `radial-gradient(circle, ${a} 0%, transparent 75%)`,
    `radial-gradient(circle, #ffffff 0%, transparent 75%)`,
    `radial-gradient(circle, ${aSoft} 0%, transparent 70%)`,
  ]

  return {
    default: def,
    hover,
    link,
    text: link,
    trail,
    ripple: [a, aSoft],
    dotHover: aSoft,
    dotLink: aSoft,
    icon: getIconByThemeId(anime.theme?.id),
    iconColor: aSoft,
  }
}

export { DEFAULT_THEME as DEFAULT_CURSOR_THEME }
