# AGENTS.md

Anime-themed showcase site. Vite + React 18 (JSX), plain Tailwind, framer-motion, react-router-dom v6, three.js. **No** TypeScript, Next.js, or shadcn — do not introduce them.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build (also the project's only verification step; there is no test, lint, typecheck, or CI)
- `npm run preview` — preview the build

After changes, run `npm run build` to verify.

## Layout

- `src/main.jsx` — synchronous IIFE applies `light`/`dark` class to `<html>` from `localStorage` **before** `createRoot.render`. Do not move theme init into React or you will reintroduce a flash.
- `src/App.jsx` — `BrowserRouter` → `LanguageProvider` → `CursorThemeProvider` → `Cursor` + `Loader` + `ParticleField` + `Navbar` + `AnimatedRoutes` (`AnimatePresence mode="wait"`) + `Footer`. Routes: `/`, `/anime/:slug`, `*` (404).
- `src/data/anime.js` — `ANIME` array + `getAnime(slug)`. **12 entries** with `theme {id, bg, grad, kanji, ...}`. Keys: `demon-slayer`, `naruto`, `jujutsu-kaisen`, `my-hero-academia`, `attack-on-titan`, `one-piece`, `detective-conan`, `dragon-ball-z`, `fullmetal-alchemist`, `death-note`, `sword-art-online`, `tokyo-ghoul`.
- `src/data/animeMal.js` — 54 KB MAL detail data. **Auto-generated** from `/tmp/jikan_fetch/result.json` via Python. Do not hand-edit. Exports `MAL_DATA` + `getMal(slug)`. Contains full synopsis, detailed metadata (type, episodes, status, aired, season, duration, rating, scores, rankings, studios, producers, genres, themes, demographics), opening/ending songs, and related entries for all 12 anime.
- `src/data/translations.js` — Japanese translations for all UI text. Exports `translations` object (key → JP string) and `enOverrides` for keys that differ from their display text. Used by `t(key)` helper in `LanguageContext`.
- `src/context/CursorThemeContext.jsx` — `useCursorTheme()`, `buildCursorThemeFromAnime(anime)`, `DEFAULT_CURSOR_THEME`. `AnimeDetail` calls `setTheme(...)` on mount and `resetTheme()` on cleanup.
- `src/context/LanguageContext.jsx` — `useLanguage()` returns `{ lang, setLang, toggle, t }`. `lang` is `'en'` | `'jp'` from `localStorage`. `t(key)` looks up translations, falling back to key if not found. Provider wraps app in `App.jsx`.
- `src/hooks/usePrefersReducedMotion.js`, `src/hooks/useTheme.js` — both default exports, both return reactively via `MutationObserver`/`matchMedia`.
- `src/lib/cubeGame.js` — Three.js Rubik's Cube game engine. Exports `initGame(container)` which returns game instance with methods for cube manipulation, scrambling, solving detection, timer, and statistics tracking. Used by `RubikCube.jsx`.

Image assets are remote (`cdn.myanimelist.net` for covers, `media.kitsu.app` for landscape banners). Font assets are local: `public/fonts/x8y12pxDenkiChip.woff2` and `public/fonts/KeinannPOPjp.ttf` loaded via `@font-face` in `src/index.css`.

## Component Inventory

**Core UI (24 components):**

1. **AnimeCardEffects.jsx** (637 lines) — Canvas-based particle effects for anime cards. Each anime has a unique particle system (embers, leaves, cursed energy, lightning, debris, bubbles, dust motes, ki orbs, transmutation sparks, feathers, digital pixels, kagune tendrils) that activates on hover. Particles can overflow card boundaries. Inspired by Animated Weather Cards CodePen.
2. **CharacterShowcase.jsx** (311 lines) — 3D parallax character cards with 5-depth layering (shadow, background, border, cutout, text). Mouse-driven rotation via lerped CSS custom properties. Horizontal scroll carousel with snap. 11 featured characters per-anime themed. Touch support for mobile.
3. **ContainerScroll.jsx** (77 lines) — Scroll-driven container with parallax and fade effects. Wraps content with `useScroll` + `useTransform`. Aceternity UI-inspired.
4. **Cursor.jsx** (318 lines) — 5-layer custom cursor (aura, ring, dot, icon, trail, ripple). Responds to `data-cursor="hover" | "text" | "link"` attributes. Auto-detects `<a>`, `<button>`, `<input>`. Per-anime icon variants from `cursorIcons/`. Uses `useMotionValue` for smooth tracking.
5. **DriftLoader.jsx** (643 lines) — Canvas loading screen with 12 anime icon types, tan-wave animation, circle-wipe transition. Drifting particles with fade-out.
6. **FeaturedAnime.jsx** (196 lines) — 3D tilt cards for 12 anime with hover effects and particle systems. Links to detail pages. Magnetic tilt on hover.
7. **FeaturedScroll.jsx** (185 lines) — Auto-rotating carousel in ContainerScroll wrapper. Cinematic scroll showcase with parallax images and text reveals.
8. **FlipLinks.jsx** (130 lines) — Letter-by-letter flip animation for footer social links. Stagger effect with `motion.span`.
9. **Footer.jsx** (100 lines) — Site footer with GridShader background, FlipLinks, bilingual description, navigation. Social links: GitHub, YouTube, Facebook, Instagram.
10. **GlitchText.jsx** (58 lines) — Glitch reveal animation with random character cycling. Configurable intensity and speed. Uses `useEffect` with interval.
11. **GlitchTranslation.jsx** (76 lines) — Language-aware glitch text with translation support. Shows EN or JP based on `useLanguage()` context. Bilingual switcher with glitch transition.
12. **GridShader.jsx** (316 lines) — WebGL2 shader ("Grid Run" tunnel effect) for footer background. Animated grid with perspective and color cycling. Adapted from CodePen.
13. **Hero.jsx** (151 lines) — Parallax hero section with multiple image layers. Gradient text, scroll indicator, CTA buttons. Uses `useScroll` + `useTransform`.
14. **HyperScroll.jsx** (321 lines) — 3D scroll-driven card tunnel with velocity-based effects. Motion blur and scale transforms. Inspired by Apple-style scroll animations.
15. **LanguageSwitch.jsx** (33 lines) — EN/JP toggle button in navbar. Persists to `localStorage` via `LanguageContext`.
16. **MagneticButton.jsx** (137 lines) — Mouse-magnetic button with 3D tilt and glow. Standard interactive button with magnetic hover tilt, press scale, `data-cursor` integration, and `.focus-ring`. Prefer this over raw `<button>`/`<a>` for primary CTAs.
17. **Navbar.jsx** (131 lines) — Sticky navbar with scroll detection, mobile menu. Logo, nav links, theme toggle, language toggle. Backdrop blur on scroll.
18. **ParticleField.jsx** (188 lines) — DOM-based star field with scroll-driven warp effect. 80 star divs with twinkle animation, parallax depth, and velocity-based vertical stretch on scroll. Hybrid idle drift + scroll warp with smooth blending.
19. **QuotesCarousel.jsx** (136 lines) — Auto-rotating quote carousel with 5 quotes. Manual controls. Bilingual support via `t()`.
20. **RubikCube.jsx** (327 lines) — Interactive Rubik's Cube game with encouragement system. Integrates `cubeGame.js` Three.js engine (~4400 lines). Configurable size (2-5), animation style, scramble length, camera angle, color scheme. Tracks solve statistics (best time, avg5, avg12, total solves).
21. **ShatterText.jsx** (96 lines) — Character-by-character scatter/assemble animation. Splits text into individual characters that start scattered (random x/y offset, rotation, scale=0, opacity=0) and stagger-animate into place when scrolled into view. Configurable stagger, duration, scatter distance. Respects `usePrefersReducedMotion()`.
22. **ThemeMotif.jsx** (688 lines) — 12 unique decorative overlays per anime theme. Per-anime decorative background motifs (kanji, patterns, gradients). Fades to ~25% opacity in light mode.
23. **ThemeSwitch.jsx** (91 lines) — Light/dark theme toggle button in navbar. Persists to `localStorage`, updates `<html>` class synchronously.
24. **Timeline.jsx** (468 lines) — Scroll-driven image comparator showing 15 anime milestones (1963-2021). Anime history timeline with scroll-triggered reveals. Bilingual event descriptions.

**Pages (2):**
- **Home.jsx** (21 lines) — Composes 7 sections: HyperScroll, FeaturedScroll, FeaturedAnime, CharacterShowcase, RubikCube, Timeline, QuotesCarousel
- **AnimeDetail.jsx** (960 lines) — Per-anime detail page with MAL data integration, character/VA info, openings/endings, gallery. Themed layout with `ThemeMotif`, cursor theme updates, light-mode overrides.

**Icon Components:**
- **ui.jsx** (108 lines) — 8 generic UI icons: Star, ArrowRight, ArrowLeft, ArrowUpRight, ChevronDown, Sparkle, CornerDownRight, Sun, Moon. 24x24 viewBox, `currentColor` fill/stroke.
- **brands.jsx** (64 lines) — 5 brand icons from simple-icons paths: Instagram, YouTube, GitHub, Facebook, (legacy: TwitterX, Discord). 24x24 viewBox. **Note:** brand icons set `width`/`height` as SVG attrs which override Tailwind size classes — pass `size={n}` prop.
- **cursorIcons/index.jsx** (330 lines) — 12 per-anime cursor glyphs indexed by `theme.id`: FlameIcon (embers), LeafIcon (leaf), CursedIcon (cursed), StarIcon (comic), WingsIcon (walls), StrawHatIcon (voyage), MagnifyIcon (mystery), EnergyIcon (saiyan), TransmuteIcon (alchemy), QuillIcon (shinigami), SwordsIcon (virtual), GhoulEyeIcon (ghoul). Centered viewBox (-12 to 12), drop-shadow filters.

**Contexts (2):**
- **CursorThemeContext.jsx** (117 lines) — `useCursorTheme()`, `buildCursorThemeFromAnime(anime)`, `DEFAULT_CURSOR_THEME`. Cursor theme state management with palette updates.
- **LanguageContext.jsx** (44 lines) — `useLanguage()` returns `{ lang, setLang, toggle }`. Bilingual state (en/jp) + localStorage persistence. No `t()` helper here (translations use direct lookup).

**Hooks (2):**
- **usePrefersReducedMotion.js** (34 lines) — OS-level motion preference detection via `matchMedia`. Returns boolean.
- **useTheme.js** (30 lines) — Reactive light/dark theme hook via `MutationObserver` on `<html>` class. Returns `'light'` | `'dark'`.

**Data (3):**
- **anime.js** (499 lines) — 12 anime entries with theme metadata. Exports `ANIME` array + `getAnime(slug)`.
- **animeMal.js** (~54KB) — Auto-generated MAL detail data. Exports `MAL_DATA` + `getMal(slug)`. **Do not hand-edit.**
- **translations.js** (215 lines) — Japanese translations for 200+ UI strings. Exports `translations` object + `enOverrides`.

**Lib (1):**
- **cubeGame.js** (~4400 lines) — Three.js Rubik's Cube game engine. Exports `initGame(container)` which returns game instance with methods for cube manipulation, scrambling, solving detection, timer, statistics tracking.

## Conventions agents miss

- **Custom cursor is global.** `src/index.css` sets `* { cursor: none !important }`. Every interactive element must work with the custom cursor in `src/components/Cursor.jsx`. Use `data-cursor="hover" | "text" | "link"` to switch states; `<a>`/`<button>`/`<input>` are auto-detected.
- **Centering motion elements with scale/size animation:** put `style={{ translateX: '-50%', translateY: '-50%' }}` on the inner `motion.div`. Tailwind's `-translate-x-1/2 -translate-y-1/2` gets clobbered by Framer's inline `transform`. See `Cursor.jsx` for the canonical pattern.
- **Reduced motion is additive only.** Per a locked-in user constraint, never remove or shorten existing animations. Gate new motion behind `usePrefersReducedMotion()` so default users keep everything; OS-level pref is the only opt-out. `src/index.css` has a global `@media (prefers-reduced-motion: reduce)` block.
- **No rainbow / multi-color sweeps.** `.gradient-shonen` is the Sunfire loop (gold → orange → red → orange → gold). Other multi-stop gradients use `from-flame via-sun to-flame` style. Per-anime accents (in `anime.js`, `ThemeMotif`, `CharacterShowcase` auras, `CursorThemeContext` defaults) are intentional brand colors and should be preserved.
- **Theme system is CSS-var driven.** `tailwind.config.js` sets `darkMode: 'class'`. `ink`/`inkSoft`/`paper`/`paperSoft` resolve via `rgb(var(--ink) / <alpha-value>)`. `:root` and `html.light` blocks in `src/index.css` redefine the vars. A "legibility patch" block in the same file rewrites common `text-white/*`, `border-white/*`, `bg-white/*` opacity classes for light mode without per-component edits — use this to flip rather than scattering `dark:` variants.
- **Anime brand accents stay static hex** (flame `#ff2d55`, sun `#ffc93c`, chakra `#22d3ee`, ki `#a855f7`, sakura `#ff5ea8`, + `*Soft` variants). They do not flip with theme.
- **Focus styles:** use the project utility `.focus-ring` (defined in `src/index.css`). It only renders on `:focus-visible`. Do not add ad-hoc `focus:` rings.
- **Icons are local SVG components.** Do not install icon packages or use emoji/Unicode glyphs as icons. Generic UI: `src/components/icons/ui.jsx`. Brands (simple-icons paths): `src/components/icons/brands.jsx` (note: brand icons set `width`/`height` as SVG attrs which override Tailwind size classes — pass `size={n}`). Per-anime cursor glyphs: `src/components/cursorIcons/index.jsx` indexed by `theme.id`.
- **`MagneticButton`** (`src/components/MagneticButton.jsx`) is the standard interactive button — already wires `data-cursor`, `focus-ring`, press scale, magnetic tilt. Prefer it over raw `<button>`/`<a>` for primary CTAs.
- **`AnimeDetail`** is light-mode aware — it overrides `theme.bg` with a cream + accent radial when `useTheme() === 'light'` and fades `ThemeMotif` to ~25% opacity. Match this when adding new themed pages.

## Translation System

- **LanguageContext** (44 lines) provides `{ lang, setLang, toggle }`. `lang` is `'en'` | `'jp'` from `localStorage`. Provider wraps app in `App.jsx`. **Note:** No `t()` helper in context — translations use direct lookup in components.
- **translations.js** (215 lines) exports `translations` object (key → JP string) and `enOverrides` for keys that differ from their display text. Contains 200+ translation keys. If a key is not found in `translations`, components should fall back to the key itself (which should be the English text).
- **GlitchTranslation** (76 lines) component handles bilingual text with glitch transition. Pass `textKey` prop (translation key) or `en`/`jp` props directly. Shows EN or JP based on `useLanguage()` context.
- **Integration pattern:** Use `const { lang } = useLanguage()` in components. Import `translations` and `enOverrides` from `translations.js`. For static text, look up `translations[key]` or fall back to key. For dynamic text with glitch effect, use `<GlitchTranslation textKey="key" />`.
- **Adding new translations:** Add key-value pairs to `translations` object in `translations.js`. If the English text differs from the key, add to `enOverrides` as well. Keys should be descriptive (e.g., `'hero_desc'`, `'Demon Slayer Corps'`). Common patterns:
  - UI labels: `'Home'`, `'Anime'`, `'Heroes'`, `'Game'`, `'Saga'`, `'Quotes'`
  - Anime titles: `'Demon Slayer'`, `'Naruto'`, etc.
  - Character roles: `'Demon Slayer Corps'`, `'Hokage in Training'`, etc.
  - Timeline events: `'Astro Boy timeline'`, `'Akira timeline'`, etc.
  - AnimeDetail sections: `'synopsis'`, `'info'`, `'characters'`, `'soundtrack'`, etc.

## Data Relationships

- **anime.js** is the source of truth for anime catalog. Contains 12 entries with basic metadata, image URLs, and theme configuration.
- **animeMal.js** extends anime.js with detailed MAL data. Use `getAnime(slug)` for basic info + theme, `getMal(slug)` for extended metadata. Both use the same slug keys.
- **Slug consistency:** All 12 slugs must match across `anime.js`, `animeMal.js`, `cursorIcons/index.jsx`, and route params. Slugs are kebab-case: `demon-slayer`, `naruto`, `jujutsu-kaisen`, `my-hero-academia`, `attack-on-titan`, `one-piece`, `detective-conan`, `dragon-ball-z`, `fullmetal-alchemist`, `death-note`, `sword-art-online`, `tokyo-ghoul`.
- **Theme IDs:** Each anime has a `theme.id` (embers, leaf, cursed, comic, walls, voyage, mystery, saiyan, alchemy, shinigami, virtual, ghoul) used to index cursor icons and motif variants. Must be unique per anime.

## CSS Utilities & Animations

**Custom utilities in `src/index.css` (859 lines):**
- `.text-stroke` — 2px stroke in `--surface` color
- `.text-stroke-white` — 2px stroke in `--surface-text` color
- `.gradient-shonen` — Sunfire gradient (gold → orange → red) with `animate-sweep`
- `.focus-ring` — Standard focus outline (only on `:focus-visible`)

**Animation keyframes:**
- `@keyframes sweep` — Background position animation for gradient text (0% → 100% background-position)
- `@keyframes floatY` — Subtle floating motion (translateY oscillation)
- `@keyframes spinSlow` — Slow 360° rotation (20s duration)
- `@keyframes spinReverse` — Reverse 360° rotation (15s duration)
- `@keyframes glitch` — Glitch effect with skew and translate
- `@keyframes pulseGlow` — Glow pulsing for accent elements
- `@keyframes fadeIn` — Opacity 0 → 1
- `@keyframes slideUp` — TranslateY from bottom with fade

**Tailwind extensions in `tailwind.config.js`:**
- Custom colors: `flame`, `flameSoft`, `sun`, `sunSoft`, `chakra`, `chakraSoft`, `ki`, `kiSoft`, `sakura`, `sakuraSoft`, `ink`, `inkSoft`, `paper`, `paperSoft`
- Custom fonts: `font-display` (Bangers), `font-jp` (x8y12pxDenkiChip), `font-pop` (KeinannPOPjp), `font-mono` (JetBrains Mono)
- Custom animations: `sweep`, `floatY`, `spinSlow`, `spinReverse`, `glitch`, `pulseGlow` (mapped to keyframes above)

## Font Loading

Custom pixel font **x8y12pxDenkiChip** is loaded from `public/fonts/x8y12pxDenkiChip.woff2` via `@font-face` in `src/index.css`:

```css
@font-face {
  font-family: 'x8y12pxDenkiChip';
  src: url('/fonts/x8y12pxDenkiChip.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

Accessible in Tailwind as `font-jp`. Used for Japanese-themed UI elements (kanji labels, decorative text).

Custom Japanese pop font **KeinannPOPjp** is loaded from `public/fonts/KeinannPOPjp.ttf` via `@font-face` in `src/index.css`. Accessible in Tailwind as `font-pop`. Used for section titles when `lang === 'jp'` — all major h2 headings switch from `font-display` (Bangers) to `font-pop` in Japanese mode. SIL OFL licensed, supports hiragana, katakana, and kanji up to JIS Level 3.

## Three.js Integration

`src/lib/cubeGame.js` is a standalone Three.js Rubik's Cube game engine (~4400 lines). Key exports:
- `initGame(container)` — Initializes game in DOM container, returns game instance
- Game instance methods: `scramble()`, `reset()`, `resize()`, `destroy()`, `updatePrefs(prefs)`
- Game emits custom events: `complete`, `timer-update`, `best-time`
- Preferences: `size` (2-5), `flip` (animation style), `scramble` (length), `fov` (camera), `theme` (color scheme), `hue`/`saturation`/`lightness` (custom colors)
- 5 anime-themed color palettes: `slayer` (Demon Slayer), `ninja` (Naruto), `cursed` (JJK), `titan` (AoT), `pirate` (One Piece)
- Anime icon face textures: each face renders a themed SVG icon (flame, leaf, cursedHex, star, wings, strawHat, energy, transmute, quill, swords, ghoulEye, magnify) via synchronous Canvas 2D drawing

`src/components/RubikCube.jsx` wraps the game engine in a React component with UI controls and statistics display. Uses `useEffect` for initialization/cleanup and `useRef` for DOM/game instance references.

## MAL Data Structure

Each entry in `MAL_DATA` (from `animeMal.js`) has:
- `slug`, `malId`, `malUrl` — identifiers and link
- `titleEnglish`, `titleJapanese` — localized titles
- `synopsis`, `background` — long-form text
- `info` object with: `type`, `episodes`, `status`, `aired`, `season`, `duration`, `rating`, `score`, `scoredBy`, `rank`, `popularity`, `members`, `favorites`, `source`, `studios[]`, `producers[]`, `licensors[]`, `genres[]`, `themes[]`, `demographics[]`
- `openings[]`, `endings[]` — theme song titles
- `characters[]` — character data with `name`, `role`, `image`, `malUrl`, `voiceActors[]` (with `name`, `language`, `image`)
- `related[]` — related anime entries with `relation` and `malId`

Use `getMal(slug)` to retrieve. Display on `AnimeDetail` pages for extended information beyond `anime.js` basics.

## opencode environment

`.opencode/skills/ui-ux-pro-max/` is a local skill (loadable via the `skill` tool with name `ui-ux-pro-max`) that scores designs/colors/typography. There is no `opencode.json` and no other instruction files.
