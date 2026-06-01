# Otaku Realm

An anime-themed showcase site built with Vite + React 18, plain Tailwind CSS, framer-motion, and react-router-dom. Custom magnetic cursor, per-anime themed pages, light/dark mode, bilingual support (English/Japanese), interactive 3D Rubik's Cube game, and a lot of animation.

## Stack

- **Vite 5** + **React 18** (JSX, no TypeScript)
- **Tailwind CSS 3** (plain — not shadcn)
- **framer-motion** for animation and scroll-driven effects
- **react-router-dom v6** for routing
- **three.js** for 3D Rubik's Cube game

## Scripts

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

There is no test, lint, typecheck, or CI pipeline. `npm run build` is the only verification step.

## Structure

```
src/
├── App.jsx              # router + global UI shell (Cursor, Loader, Particles, Navbar, Footer)
├── main.jsx             # theme init runs before React renders to avoid flash
├── index.css            # Tailwind layers + CSS-var theme tokens + utilities + custom font
├── components/          # 22 shared UI components
│   ├── CharacterShowcase.jsx    # hero character cards with aura effects
│   ├── ContainerScroll.jsx      # scroll-driven container animations
│   ├── Cursor.jsx               # 5-layer custom cursor with per-anime icons
│   ├── DriftLoader.jsx          # animated loading screen
│   ├── FeaturedAnime.jsx        # anime card grid with hover effects
│   ├── FeaturedScroll.jsx       # cinematic scroll showcase section
│   ├── FlipLinks.jsx            # animated flip text links
│   ├── Footer.jsx               # site footer with social links
│   ├── GlitchText.jsx           # glitch text effect component
│   ├── GlitchTranslation.jsx    # bilingual glitch text switcher
│   ├── GridShader.jsx           # animated grid background shader
│   ├── Hero.jsx                 # landing hero section
│   ├── HyperScroll.jsx          # hyper-speed scroll effects
│   ├── LanguageSwitch.jsx       # EN/JP language toggle
│   ├── MagneticButton.jsx       # magnetic hover button with tilt
│   ├── Navbar.jsx               # navigation bar with theme/language toggles
│   ├── ParticleField.jsx        # animated particle background
│   ├── QuotesCarousel.jsx       # rotating anime quotes carousel
│   ├── RubikCube.jsx            # interactive 3D Rubik's Cube game
│   ├── ThemeMotif.jsx           # per-anime decorative background motifs
│   ├── ThemeSwitch.jsx          # light/dark theme toggle
│   ├── Timeline.jsx             # anime history timeline
│   ├── icons/                   # local SVG icon set (UI + brand)
│   └── cursorIcons/             # per-anime cursor glyphs (12 variants)
├── context/
│   ├── CursorThemeContext.jsx   # cursor theme state management
│   └── LanguageContext.jsx      # bilingual state (en/jp) + t() helper
├── data/
│   ├── anime.js                 # 12 anime entries with theme metadata
│   ├── animeMal.js              # auto-generated MAL detail data (do not hand-edit)
│   └── translations.js          # Japanese translations for all UI text
├── hooks/
│   ├── usePrefersReducedMotion.js  # OS-level motion preference detection
│   └── useTheme.js                 # reactive light/dark theme hook
├── lib/
│   └── cubeGame.js              # Three.js Rubik's Cube game engine
└── pages/
    ├── Home.jsx                 # landing page with all showcase sections
    └── AnimeDetail.jsx          # per-anime detail page with themed layout
```

Routes: `/` (home), `/anime/:slug` (per-anime detail page), `*` (404).

## Featured Anime (12 entries)

The site showcases 12 iconic anime series, each with a unique theme, color palette, and visual motif:

1. **demon-slayer** — Demon Slayer: Kimetsu no Yaiba
2. **naruto** — Naruto
3. **jujutsu-kaisen** — Jujutsu Kaisen
4. **my-hero-academia** — My Hero Academia
5. **attack-on-titan** — Attack on Titan
6. **one-piece** — One Piece
7. **detective-conan** — Detective Conan
8. **dragon-ball-z** — Dragon Ball Z
9. **fullmetal-alchemist** — Fullmetal Alchemist: Brotherhood
10. **death-note** — Death Note
11. **sword-art-online** — Sword Art Online
12. **tokyo-ghoul** — Tokyo Ghoul

Each anime entry in `src/data/anime.js` includes:
- Basic metadata (title, year, studio, episodes, genres, rating)
- Image assets (cover, banner, bannerSlides, galleryHd) from MyAnimeList CDN
- Theme configuration (id, bg gradient, kanji character, accent colors, panel style)

## Key Features

### Custom Cursor System
`src/index.css` sets `* { cursor: none }` globally. `src/components/Cursor.jsx` renders a 5-layer interactive cursor that responds to hover states via `data-cursor` attributes. Each anime has a unique cursor icon variant (flame, leaf, cursed energy, etc.) defined in `src/components/cursorIcons/`.

### Light/Dark Theme
Toggle in the navbar persists to `localStorage`. Theme is applied as a class on `<html>` synchronously in `main.jsx` before React mounts to prevent flash. CSS variables in `:root` / `html.light` blocks in `src/index.css` redefine `--ink`, `--paper`, and other theme tokens. Anime brand accent colors (flame, sun, chakra, ki, sakura, etc.) remain static hex values and do not flip with theme.

### Bilingual Support (English/Japanese)
`src/context/LanguageContext.jsx` provides language state (`'en'` | `'jp'`) and a `t(key)` translation helper. All UI text is translatable via `src/data/translations.js`. The language toggle in the navbar persists to `localStorage`. Components use `<GlitchTranslation>` for animated language switching.

### Per-Anime Theming
Each anime in `data/anime.js` carries a `theme` block with:
- `id` — motif identifier (embers, leaf, cursed, comic, walls, voyage, etc.)
- `bg` — radial gradient for detail page background
- `grad` — linear gradient for accents and decorative elements
- `kanji` — Japanese character representing the anime's essence
- `accent` / `accentSoft` — brand colors for UI highlights
- `panelStyle` — decorative panel variant (patternedScroll, crackedGlass, comicHalftone, etc.)

`AnimeDetail` pages consume this theme to dramatically change the page's look. `CursorThemeContext` updates the cursor palette. `ThemeMotif` renders decorative background layers. In light mode, `AnimeDetail` overrides `theme.bg` with a cream + accent radial and fades motifs to ~25% opacity.

### MAL (MyAnimeList) Integration
`src/data/animeMal.js` is auto-generated from MyAnimeList API data via Python script. It contains detailed information for all 12 anime:
- Full synopsis and background
- Detailed metadata (type, episodes, status, aired dates, season, duration, rating)
- Scores, rankings, popularity metrics
- Studios, producers, licensors
- Genres, themes, demographics
- Opening/ending theme songs
- Related anime entries

The `getMal(slug)` helper retrieves this data for display on detail pages. **Do not hand-edit this file** — regenerate from source data.

### Interactive 3D Rubik's Cube Game
`src/components/RubikCube.jsx` integrates a fully playable 3D Rubik's Cube powered by Three.js (`src/lib/cubeGame.js`). Features include:
- Configurable cube sizes (2x2x2 to 5x5x5)
- Multiple animation styles (Swift, Smooth, Bounce)
- Customizable scramble lengths
- Camera angle options (Orthographic/Perspective)
- Five color schemes (Cube, Erno, Dust, Camo, Rain)
- Custom theme editor (hue, saturation, lightness)
- Solve statistics tracking (best time, averages, total solves)
- Timer and completion detection

### Reduced Motion Support
`usePrefersReducedMotion()` hook and a global `@media (prefers-reduced-motion: reduce)` block in `index.css` neutralize animations when the user has the OS preference set. Per project constraint, reduced motion is **additive only** — new animations are gated behind the hook, but existing animations remain for default users.

### Animation System
Extensive use of framer-motion for:
- Page transitions (`AnimatePresence mode="wait"`)
- Scroll-driven effects (`useScroll`, `useTransform`)
- Hover interactions (scale, tilt, magnetic pull)
- Stagger animations for lists and grids
- Custom spring physics and easing curves

Custom CSS animations in `src/index.css`:
- `.gradient-shonen` — Sunfire loop (gold → orange → red → orange → gold)
- `@keyframes sweep` — background position animation for gradient text
- `@keyframes float` — subtle floating motion
- `@keyframes pulse` — scale pulsing
- Various other utility animations

## Assets

### Images
All anime images are remote from MyAnimeList CDN (`cdn.myanimelist.net`). No local image pipeline or optimization.

### Fonts
Custom pixel font **x8y12pxDenkiChip** loaded from `public/fonts/x8y12pxDenkiChip.woff2` via `@font-face` in `src/index.css`. Used for retro/pixel-style UI elements.

## Data Flow

1. **Anime Catalog** (`src/data/anime.js`) — 12 entries with theme metadata, image URLs, and basic info
2. **MAL Details** (`src/data/animeMal.js`) — Extended metadata fetched from MyAnimeList API
3. **Translations** (`src/data/translations.js`) — Japanese translations for all UI strings
4. **Context Providers** — `CursorThemeContext` and `LanguageContext` wrap the app in `App.jsx`
5. **Pages** — `Home` and `AnimeDetail` consume data via `getAnime(slug)` and `getMal(slug)` helpers
6. **Components** — Receive anime data as props and render themed UI

## Working in this repo

See [`AGENTS.md`](./AGENTS.md) for conventions and traps that aren't obvious from the file tree:
- Cursor system integration patterns
- Motion-centering pattern for scale/size animations
- Theme-var system and legibility patches
- Focus styles (`.focus-ring` utility)
- Icon rules (local SVG components only)
- `MagneticButton` as the standard interactive button
- Light-mode awareness in themed components
- Translation system integration
- Relationship between `anime.js` and `animeMal.js`
