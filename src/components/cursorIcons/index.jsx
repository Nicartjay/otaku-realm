/**
 * Per-anime SVG cursor icons.
 *
 * Each component takes { color, size = 22 } and renders an SVG glyph
 * centered around (0,0) at a fixed pixel size. They're rendered inside
 * the custom cursor's ring on themed pages.
 */

const wrap = (children, size, color) => (
  <svg
    width={size}
    height={size}
    viewBox="-12 -12 24 24"
    fill="none"
    style={{
      filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 14px ${color})`,
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
)

// 🍃 Naruto — leaf
export function LeafIcon({ color = '#ffb703', size = 22 }) {
  return wrap(
    <g>
      <path
        d="M -8 6 C -8 -4, 0 -8, 8 -6 C 6 2, 0 8, -8 6 Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M -7 5 C -3 0, 2 -3, 7 -5"
        stroke="#0b0418"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>,
    size,
    color
  )
}

// 🔥 Demon Slayer — flame
export function FlameIcon({ color = '#ff3b3b', size = 22 }) {
  return wrap(
    <g>
      <path
        d="M 0 -9 C 5 -4, 7 0, 5 5 C 4 7, 1 8, 0 8 C -1 8, -4 7, -5 5 C -7 0, -5 -4, 0 -9 Z"
        fill={color}
        opacity="0.95"
      />
      <path
        d="M 0 -2 C 2 0, 3 3, 1 6 C 0 7, -1 7, -2 6 C -3 4, -3 1, 0 -2 Z"
        fill="#ffe066"
        opacity="0.9"
      />
    </g>,
    size,
    color
  )
}

// ⛧ Jujutsu Kaisen — cursed hex
export function CursedIcon({ color = '#a855f7', size = 22 }) {
  return wrap(
    <g>
      <polygon
        points="0,-9 8,-4 8,4 0,9 -8,4 -8,-4"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
      />
      <polygon
        points="0,-5 4,-2 4,2 0,5 -4,2 -4,-2"
        fill={color}
        opacity="0.5"
      />
      <line x1="-8" y1="-4" x2="8" y2="4" stroke={color} strokeWidth="0.8" opacity="0.7" />
      <line x1="8" y1="-4" x2="-8" y2="4" stroke={color} strokeWidth="0.8" opacity="0.7" />
    </g>,
    size,
    color
  )
}

// ★ My Hero Academia — hero star burst
export function StarIcon({ color = '#22d3ee', size = 22 }) {
  return wrap(
    <g>
      <polygon
        points="0,-9 2.5,-3 9,-3 4,1 6,8 0,4 -6,8 -4,1 -9,-3 -2.5,-3"
        fill={color}
      />
      <polygon
        points="0,-5 1.4,-1.5 5,-1.5 2.2,0.5 3.3,4.5 0,2 -3.3,4.5 -2.2,0.5 -5,-1.5 -1.4,-1.5"
        fill="#ffffff"
        opacity="0.85"
      />
    </g>,
    size,
    color
  )
}

// 🪽 Attack on Titan — wings of freedom
export function WingsIcon({ color = '#c0392b', size = 22 }) {
  return wrap(
    <g>
      {/* left wing */}
      <path
        d="M -1 0 C -3 -2, -6 -3, -10 -1 C -7 0, -5 1, -1 1 Z"
        fill={color}
        opacity="0.95"
      />
      <path
        d="M -1 1 C -4 2, -7 3, -10 2 C -7 4, -4 5, -1 3 Z"
        fill={color}
        opacity="0.7"
      />
      {/* right wing */}
      <path
        d="M 1 0 C 3 -2, 6 -3, 10 -1 C 7 0, 5 1, 1 1 Z"
        fill="#f5f5f5"
        opacity="0.95"
      />
      <path
        d="M 1 1 C 4 2, 7 3, 10 2 C 7 4, 4 5, 1 3 Z"
        fill="#f5f5f5"
        opacity="0.7"
      />
      {/* spine */}
      <line x1="0" y1="-3" x2="0" y2="5" stroke={color} strokeWidth="1.4" />
    </g>,
    size,
    color
  )
}

// 🎩 One Piece — straw hat
export function StrawHatIcon({ color = '#fbbf24', size = 22 }) {
  return wrap(
    <g>
      {/* brim */}
      <ellipse cx="0" cy="3" rx="10" ry="3" fill={color} />
      <ellipse cx="0" cy="3" rx="10" ry="3" fill="none" stroke="#0b0418" strokeWidth="0.6" />
      {/* crown */}
      <path
        d="M -5 3 C -5 -3, -4 -7, 0 -7 C 4 -7, 5 -3, 5 3 Z"
        fill={color}
      />
      {/* red ribbon */}
      <rect x="-5" y="1" width="10" height="2" fill="#ff3b3b" />
    </g>,
    size,
    color
  )
}

// Default ring-glow dot for non-themed pages (returns null so the
// existing white dot in Cursor.jsx is used instead)
export const ICONS = {
  embers: FlameIcon,
  leaf: LeafIcon,
  cursed: CursedIcon,
  comic: StarIcon,
  walls: WingsIcon,
  voyage: StrawHatIcon,
}

export function getIconByThemeId(id) {
  return ICONS[id] || null
}
