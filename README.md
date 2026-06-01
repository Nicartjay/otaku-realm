# Otaku Realm

An anime-themed showcase site built with Vite + React 18, plain Tailwind CSS, framer-motion, and react-router-dom. Features a custom magnetic cursor, per-anime themed pages, light/dark mode, bilingual support (English/Japanese), interactive 3D Rubik's Cube game, and extensive animations.

## Stack

- **Vite 8.0** + **React 18.3** (JSX, no TypeScript)
- **Tailwind CSS 3.4** (plain — not shadcn)
- **framer-motion 12.40** for animation and scroll-driven effects
- **react-router-dom 6.30** for routing
- **three.js 0.184** for 3D Rubik's Cube game and WebGL shaders

## Scripts

```bash
npm install
npm run dev       # start the dev server (Vite)
npm run build     # production build to dist/
npm run preview   # preview the production build
```

There is no test, lint, typecheck, or CI pipeline. `npm run build` is the only verification step.

## Project Structure

```
src/
├── App.jsx              # router + global UI shell (Cursor, Loader, Particles, Navbar, Footer)
├── main.jsx             # theme init runs before React renders to avoid flash
├── index.css            # 859 lines: Tailwind layers + CSS-var theme tokens + utilities + custom fonts
├── components/          # 24 shared UI components
│   ├── AnimeCardEffects.jsx     # 637 lines: canvas-based particle effects (12 anime-specific systems)
│   ├── CharacterShowcase.jsx    # 311 lines: 3D parallax character cards (5-depth layers, lerped rotation)
│   ├── ContainerScroll.jsx      # 77 lines: scroll-driven container with parallax
│   ├── Cursor.jsx               # 318 lines: 5-layer custom cursor (aura, ring, dot, trail, ripple)
│   ├── DriftLoader.jsx          # 643 lines: canvas loading screen with 12 anime icon types
│   ├── FeaturedAnime.jsx        # 196 lines: 3D tilt cards with hover effects
│   ├── FeaturedScroll.jsx       # 185 lines: auto-rotating carousel in ContainerScroll
│   ├── FlipLinks.jsx            # 130 lines: letter-by-letter flip animation
│   ├── Footer.jsx               # 100 lines: footer with GridShader background
│   ├── GlitchText.jsx           # 58 lines: glitch reveal with random character cycling
│   ├── GlitchTranslation.jsx    # 76 lines: language-aware glitch text
│   ├── GridShader.jsx           # 316 lines: WebGL2 shader ("Grid Run" tunnel effect)
│   ├── Hero.jsx                 # 151 lines: parallax hero with multiple image layers
│   ├── HyperScroll.jsx          # 321 lines: 3D scroll-driven card tunnel
│   ├── LanguageSwitch.jsx       # 33 lines: EN/JP toggle button
│   ├── MagneticButton.jsx       # 137 lines: mouse-magnetic button with 3D tilt
│   ├── Navbar.jsx               # 131 lines: sticky navbar with scroll detection
│   ├── ParticleField.jsx        # 188 lines: DOM-based star field with scroll-driven warp
│   ├── QuotesCarousel.jsx       # 136 lines: auto-rotating quote carousel (5 quotes)
│   ├── RubikCube.jsx            # 327 lines: interactive Rubik's Cube with encouragement system
│   ├── ShatterText.jsx          # 96 lines: character-by-character scatter/assemble animation
│   ├── ThemeMotif.jsx           # 688 lines: 12 unique decorative overlays per anime
│   ├── ThemeSwitch.jsx          # 91 lines: light/dark mode toggle
│   ├── Timeline.jsx             # 468 lines: scroll-driven image comparator (15 milestones)
│   ├── icons/
│   │   ├── ui.jsx               # 108 lines: 8 generic UI icons (Star, Arrow, Chevron, Sun, Moon, etc.)
│   │   └── brands.jsx           # 64 lines: 5 brand icons (Instagram, YouTube, GitHub, Facebook, + legacy)
│   └── cursorIcons/
│       └── index.jsx            # 330 lines: 12 per-anime cursor glyphs (flame, leaf, cursed, etc.)
├── context/
│   ├── CursorThemeContext.jsx   # 117 lines: cursor theme state + buildCursorThemeFromAnime()
│   └── LanguageContext.jsx      # 44 lines: bilingual state (en/jp) + localStorage persistence
├── data/
│   ├── anime.js                 # 499 lines: 12 anime entries with theme metadata
│   ├── animeMal.js              # ~54KB: auto-generated MAL detail data (do not hand-edit)
│   └── translations.js          # 215 lines: Japanese translations + enOverrides
├── hooks/
│   ├── usePrefersReducedMotion.js  # 34 lines: OS-level motion preference detection
│   └── useTheme.js                 # 30 lines: reactive light/dark theme hook
├── lib/
│   └── cubeGame.js              # ~4400 lines: Three.js Rubik's Cube game engine
└── pages/
    ├── Home.jsx                 # 21 lines: composes 7 showcase sections
    └── AnimeDetail.jsx          # 960 lines: per-anime detail page with MAL data integration
```

**Routes:** `/` (home), `/anime/:slug` (per-anime detail page), `*` (404)

**Total Component Count:** 24 core UI components + 2 pages + 3 icon sets + 2 contexts + 2 hooks + 1 game engine

## Featured Anime (12 entries)

The site showcases 12 iconic anime series, each with a unique theme, color palette, and visual motif:

1. **demon-slayer** — Demon Slayer: Kimetsu no Yaiba (2019, ufotable) — Theme: `embers` 🔥
2. **naruto** — Naruto (2002, Pierrot) — Theme: `leaf` 🍃
3. **jujutsu-kaisen** — Jujutsu Kaisen (2020, MAPPA) — Theme: `cursed` ⛧
4. **my-hero-academia** — My Hero Academia (2016, Bones) — Theme: `comic` ★
5. **attack-on-titan** — Attack on Titan (2013, WIT/MAPPA) — Theme: `walls` 🪽
6. **one-piece** — One Piece (1999, Toei Animation) — Theme: `voyage` 🎩
7. **detective-conan** — Detective Conan (1996, TMS Entertainment) — Theme: `mystery` 🔍
8. **dragon-ball-z** — Dragon Ball Z (1989, Toei Animation) — Theme: `saiyan` ⚡
9. **fullmetal-alchemist** — Fullmetal Alchemist: Brotherhood (2009, Bones) — Theme: `alchemy` ⚙️
10. **death-note** — Death Note (2006, Madhouse) — Theme: `shinigami` 📓
11. **sword-art-online** — Sword Art Online (2012, A-1 Pictures) — Theme: `virtual` ⚔️
12. **tokyo-ghoul** — Tokyo Ghoul (2014, Pierrot) — Theme: `ghoul` 👁️

Each anime entry in `src/data/anime.js` (499 lines) includes:
- Basic metadata (title, Japanese title, romaji, year, studio, episodes, genres, rating)
- Image assets (cover, banner, bannerSlides, galleryHd) from MyAnimeList CDN
- Theme configuration (id, bg gradient, kanji character, accent colors, panel style, tagline)
- Color palette (accent, accentSoft for brand consistency)

## Key Features

### Custom Cursor System (318 lines)
`src/index.css` sets `* { cursor: none !important }` globally. `src/components/Cursor.jsx` renders a 5-layer interactive cursor:
- **Aura** — outer glow ring (scales on hover)
- **Ring** — main cursor ring (color changes based on state)
- **Dot** — center dot (scales and changes color)
- **Icon** — per-anime themed icon (12 variants)
- **Trail** — particle trail following cursor movement
- **Ripple** — click ripple effect

Responds to hover states via `data-cursor="hover" | "text" | "link"` attributes. Auto-detects `<a>`, `<button>`, and `<input>` elements. Each anime has a unique cursor icon variant defined in `src/components/cursorIcons/index.jsx` (330 lines):
- `embers` (flame), `leaf`, `cursed` (hex), `comic` (star), `walls` (wings), `voyage` (straw hat)
- `mystery` (magnifying glass), `saiyan` (energy sphere), `alchemy` (transmutation circle)
- `shinigami` (quill), `virtual` (crossed swords), `ghoul` (kakugan eye)

### Light/Dark Theme
Toggle in the navbar persists to `localStorage`. Theme is applied as a class on `<html>` **synchronously** in `main.jsx` before React mounts to prevent flash. CSS variables in `:root` / `html.light` blocks in `src/index.css` (859 lines) redefine `--ink`, `--paper`, and other theme tokens.

**Important:** Anime brand accent colors (flame `#ff2d55`, sun `#ffc93c`, chakra `#22d3ee`, ki `#a855f7`, sakura `#ff5ea8`, + `*Soft` variants) remain static hex values and do not flip with theme.

### Bilingual Support (English/Japanese)
`src/context/LanguageContext.jsx` (44 lines) provides language state (`'en'` | `'jp'`) and a `t(key)` translation helper. All UI text is translatable via `src/data/translations.js` (215 lines with 200+ translation keys). The language toggle in the navbar persists to `localStorage`. Components use `<GlitchTranslation>` (76 lines) for animated language switching with glitch effects.

### Per-Anime Theming
Each anime in `data/anime.js` carries a `theme` block with:
- `id` — motif identifier (embers, leaf, cursed, comic, walls, voyage, mystery, saiyan, alchemy, shinigami, virtual, ghoul)
- `bg` — radial gradient for detail page background
- `grad` — linear gradient for accents and decorative elements
- `kanji` — Japanese character representing the anime's essence (炎, 忍, 呪, 雄, 進, 海, 真, 気, 錬, 死, 剣, 喰)
- `kanjiLabel` — English translation of kanji
- `tagline` — anime-specific catchphrase
- `accent` / `accentSoft` — brand colors for UI highlights
- `fontTitle` / `fontJp` — font family overrides
- `panelStyle` — decorative panel variant (patternedScroll, scrollPaper, crackedGlass, comicHalftone, sepia, compass, detective, powerUp, transmutation, notebook, digitalGrid, fractured)

`AnimeDetail` pages (960 lines) consume this theme to dramatically change the page's look. `CursorThemeContext` (117 lines) updates the cursor palette via `buildCursorThemeFromAnime()`. `ThemeMotif` (688 lines) renders 12 unique decorative background layers. In light mode, `AnimeDetail` overrides `theme.bg` with a cream + accent radial and fades motifs to ~25% opacity.

### MAL (MyAnimeList) Integration
`src/data/animeMal.js` (~54KB, auto-generated) contains detailed information for all 12 anime fetched from MyAnimeList API via Python script:
- Full synopsis and background text
- Detailed metadata (type, episodes, status, aired dates, season, duration, rating)
- Scores, rankings, popularity metrics (score, scoredBy, rank, popularity, members, favorites)
- Studios, producers, licensors arrays
- Genres, themes, demographics arrays
- Opening/ending theme songs (with artist names)
- Character data with voice actors (name, role, image, malUrl, voiceActors with language)
- Related anime entries (relation type, malId)

The `getMal(slug)` helper retrieves this data for display on `AnimeDetail` pages. **Do not hand-edit this file** — regenerate from `/tmp/jikan_fetch/result.json` via Python script.

### Interactive 3D Rubik's Cube Game
`src/components/RubikCube.jsx` (327 lines) integrates a fully playable 3D Rubik's Cube powered by Three.js (`src/lib/cubeGame.js`, ~4400 lines). Features include:
- Configurable cube sizes (2x2x2 to 5x5x5)
- Multiple animation styles (Swift, Smooth, Bounce)
- Customizable scramble lengths (20-60 moves)
- Camera angle options (Orthographic/Perspective with adjustable FOV)
- 5 anime-themed color palettes: Slayer (Demon Slayer), Ninja (Naruto), Cursed (JJK), Titan (AoT), Pirate (One Piece)
- Anime icon face textures (flame, leaf, cursedHex, star, wings, strawHat, energy, transmute, quill, swords, ghoulEye, magnify) rendered via Canvas 2D
- Theme button to cycle between anime palettes during gameplay
- Custom theme editor (hue, saturation, lightness sliders)
- Solve statistics tracking (best time, average of 5, average of 12, total solves)
- Timer with millisecond precision
- Completion detection with encouragement messages
- Keyboard controls and mouse drag rotation
- Light/dark mode aware (adjusts scene lighting and piece body color)

### Reduced Motion Support
`usePrefersReducedMotion()` hook (34 lines) and a global `@media (prefers-reduced-motion: reduce)` block in `index.css` neutralize animations when the user has the OS preference set. Per project constraint, reduced motion is **additive only** — new animations are gated behind the hook, but existing animations remain for default users. This ensures the full motion-rich experience is the default.

### Animation System
Extensive use of **framer-motion 12.40** for:
- Page transitions (`AnimatePresence mode="wait"`)
- Scroll-driven effects (`useScroll`, `useTransform`, `useInView`)
- Hover interactions (scale, tilt, magnetic pull)
- Stagger animations for lists and grids
- Custom spring physics and easing curves
- Motion values and animated variants

Custom CSS animations in `src/index.css` (859 lines):
- `.gradient-shonen` — Sunfire loop (gold → orange → red → orange → gold) with `animate-sweep`
- `@keyframes sweep` — background position animation for gradient text (0% → 100%)
- `@keyframes floatY` — subtle floating motion (translateY oscillation)
- `@keyframes spinSlow` — slow 360° rotation (20s)
- `@keyframes spinReverse` — reverse rotation (15s)
- `@keyframes glitch` — glitch effect with skew and translate
- `@keyframes pulseGlow` — glow pulsing for accents
- Plus Rubik's Cube game styles, 3D character card styles, and HyperScroll styles

## Assets

### Images
All anime images are remote from MyAnimeList CDN (`cdn.myanimelist.net`) for portrait covers and Kitsu CDN (`media.kitsu.app`) for landscape banners. No local image pipeline or optimization. Each anime has:
- `cover` — portrait poster for cards (MyAnimeList CDN)
- `banner` — landscape key visual for detail page hero (Kitsu CDN)
- `bannerSlides` — array of 3 additional key visuals for rotating carousel
- `galleryHd` — array of 3 stills for atmosphere gallery

### Fonts
Two custom fonts loaded via `@font-face` in `src/index.css`:
- **x8y12pxDenkiChip** (`public/fonts/x8y12pxDenkiChip.woff2`) — pixel font for Japanese-themed UI elements, kanji labels, decorative text (`font-jp`)
- **KeinannPOPjp** (`public/fonts/KeinannPOPjp.ttf`) — Japanese pop font for section titles in JP mode (`font-pop`). All major h2 headings switch from Bangers to KeinannPOPjp when language is set to Japanese. SIL OFL licensed, supports hiragana, katakana, kanji up to JIS Level 3.

Additional fonts from Google Fonts (via Tailwind config):
- **Bangers** — display font (`font-display`) for section headings in EN mode
- **Poppins** — body font (default)
- **JetBrains Mono** — monospace font (`font-mono`)

## Data Flow

1. **Anime Catalog** (`src/data/anime.js`, 499 lines) — 12 entries with theme metadata, image URLs, and basic info. Exports `ANIME` array and `getAnime(slug)` helper.
2. **MAL Details** (`src/data/animeMal.js`, ~54KB) — Extended metadata fetched from MyAnimeList API. Exports `MAL_DATA` object and `getMal(slug)` helper. **Auto-generated, do not hand-edit.**
3. **Translations** (`src/data/translations.js`, 215 lines) — Japanese translations for 200+ UI strings. Exports `translations` object and `enOverrides` for keys that differ from display text.
4. **Context Providers** — `LanguageProvider` and `CursorThemeProvider` wrap the app in `App.jsx`
5. **Pages** — `Home` (21 lines) and `AnimeDetail` (960 lines) consume data via `getAnime(slug)` and `getMal(slug)` helpers
6. **Components** — Receive anime data as props and render themed UI with per-anime particle effects, cursor icons, and decorative motifs

## Icon System

All icons are **local SVG components** — no icon packages or emoji/Unicode glyphs:

### UI Icons (`src/components/icons/ui.jsx`, 108 lines)
8 generic UI icons with 24x24 viewBox, `currentColor` fill/stroke:
- `StarIcon` (filled/outline), `ArrowRightIcon`, `ArrowLeftIcon`, `ArrowUpRightIcon`
- `ChevronDownIcon`, `SparkleIcon`, `CornerDownRightIcon`
- `SunIcon` (theme toggle), `MoonIcon` (theme toggle)

### Brand Icons (`src/components/icons/brands.jsx`, 64 lines)
5 brand icons from simple-icons paths with 24x24 viewBox:
- `InstagramIcon`, `YoutubeIcon`, `GithubIcon`, `FacebookIcon` (active)
- `TwitterXIcon`, `DiscordIcon` (legacy, still exported but unused)
- **Note:** Brand icons set `width`/`height` as SVG attributes which override Tailwind size classes — pass `size={n}` prop instead.

### Cursor Icons (`src/components/cursorIcons/index.jsx`, 330 lines)
12 per-anime cursor glyphs with centered viewBox (-12 to 12), drop-shadow filters:
- `FlameIcon` (embers), `LeafIcon` (leaf), `CursedIcon` (cursed), `StarIcon` (comic)
- `WingsIcon` (walls), `StrawHatIcon` (voyage), `MagnifyIcon` (mystery), `EnergyIcon` (saiyan)
- `TransmuteIcon` (alchemy), `QuillIcon` (shinigami), `SwordsIcon` (virtual), `GhoulEyeIcon` (ghoul)
- Exported via `ICONS` object and `getIconByThemeId(id)` helper

## Working in this repo

See [`AGENTS.md`](./AGENTS.md) for conventions and traps that aren't obvious from the file tree:
- Cursor system integration patterns (`data-cursor` attributes)
- Motion-centering pattern for scale/size animations (use inline `style` not Tailwind classes)
- Theme-var system and legibility patches (CSS variables for light/dark mode)
- Focus styles (`.focus-ring` utility, only on `:focus-visible`)
- Icon rules (local SVG components only, no packages)
- `MagneticButton` as the standard interactive button (already wired for cursor, focus, tilt)
- Light-mode awareness in themed components (`AnimeDetail` overrides)
- Translation system integration (`useLanguage()` hook, `t(key)` helper, `<GlitchTranslation>`)
- Relationship between `anime.js` and `animeMal.js` (same slug keys, complementary data)
- Reduced motion is additive only (never remove existing animations)
