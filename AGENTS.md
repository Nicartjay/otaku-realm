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

Image assets are remote (`cdn.myanimelist.net`). Font assets are local: `public/fonts/x8y12pxDenkiChip.woff2` loaded via `@font-face` in `src/index.css`.

## Component Inventory

**Core UI (22 components):**

1. **CharacterShowcase.jsx** — Hero character cards with animated aura effects, per-anime themed. Uses `motion.div` with scale/opacity animations.
2. **ContainerScroll.jsx** — Scroll-driven container with parallax and fade effects. Wraps content with `useScroll` + `useTransform`.
3. **Cursor.jsx** — 5-layer custom cursor (outer ring, inner ring, dot, icon, trail). Responds to `data-cursor` attributes. Per-anime icon variants from `cursorIcons/`.
4. **DriftLoader.jsx** — Animated loading screen with drifting particles and fade-out transition.
5. **FeaturedAnime.jsx** — Anime card grid with hover scale, glow, and magnetic tilt. Links to detail pages.
6. **FeaturedScroll.jsx** — Cinematic scroll showcase section with parallax images and text reveals.
7. **FlipLinks.jsx** — Animated flip text links with stagger. Used in footer and navigation.
8. **Footer.jsx** — Site footer with social links (GitHub, Twitter, MAL), bilingual description, and FlipLinks navigation.
9. **GlitchText.jsx** — Glitch text effect with random character swaps and color shifts. Configurable intensity and speed.
10. **GlitchTranslation.jsx** — Bilingual text switcher with glitch transition. Shows EN or JP based on `useLanguage()` context.
11. **GridShader.jsx** — Animated grid background shader with perspective and color cycling.
12. **Hero.jsx** — Landing hero section with gradient text, scroll indicator, and CTA buttons.
13. **HyperScroll.jsx** — Hyper-speed scroll effects with motion blur and scale transforms.
14. **LanguageSwitch.jsx** — EN/JP language toggle button in navbar. Persists to `localStorage` via `LanguageContext`.
15. **MagneticButton.jsx** — Standard interactive button with magnetic hover tilt, press scale, `data-cursor` integration, and `.focus-ring`. Prefer this over raw `<button>`/`<a>` for primary CTAs.
16. **Navbar.jsx** — Navigation bar with logo, nav links, theme toggle, and language toggle. Sticky with backdrop blur.
17. **ParticleField.jsx** — Animated particle background with mouse interaction. Canvas-based with `requestAnimationFrame` loop.
18. **QuotesCarousel.jsx** — Rotating anime quotes carousel with auto-advance and manual controls. Bilingual support via `t()`.
19. **RubikCube.jsx** — Interactive 3D Rubik's Cube game. Integrates `cubeGame.js` Three.js engine. Configurable size, animation style, scramble length, camera angle, and color scheme. Tracks solve statistics.
20. **ThemeMotif.jsx** — Per-anime decorative background motifs (kanji, patterns, gradients). Fades to ~25% opacity in light mode.
21. **ThemeSwitch.jsx** — Light/dark theme toggle button in navbar. Persists to `localStorage`, updates `<html>` class.
22. **Timeline.jsx** — Anime history timeline with scroll-triggered reveals. Bilingual event descriptions.

**Icon Components:**
- `src/components/icons/ui.jsx` — Generic UI icons (arrow, close, menu, settings, trophy, etc.). SVG components.
- `src/components/icons/brands.jsx` — Brand icons from simple-icons paths (GitHub, Twitter, MyAnimeList, etc.). Note: brand icons set `width`/`height` as SVG attrs which override Tailwind size classes — pass `size={n}` prop.
- `src/components/cursorIcons/index.jsx` — Per-anime cursor glyphs indexed by `theme.id`. 12 variants: embers, leaf, cursed, comic, walls, voyage, mystery, saiyan, alchemy, shinigami, virtual, ghoul.

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

- **LanguageContext** provides `{ lang, setLang, toggle, t }`. `lang` is `'en'` | `'jp'`. `t(key)` looks up translations from `src/data/translations.js`.
- **translations.js** exports `translations` object (key → JP string) and `enOverrides` for keys that differ from their display text. If a key is not found in `translations`, `t()` returns the key itself (which should be the English text).
- **GlitchTranslation** component handles bilingual text with glitch transition. Pass `textKey` prop (translation key) or `en`/`jp` props directly.
- **Integration pattern:** Use `const { lang, t } = useLanguage()` in components. For static text, use `t('key')`. For dynamic text with glitch effect, use `<GlitchTranslation textKey="key" />`.
- **Adding new translations:** Add key-value pairs to `translations` object in `translations.js`. If the English text differs from the key, add to `enOverrides` as well. Keys should be descriptive (e.g., `'hero_desc'`, `'Demon Slayer Corps'`).

## Data Relationships

- **anime.js** is the source of truth for anime catalog. Contains 12 entries with basic metadata, image URLs, and theme configuration.
- **animeMal.js** extends anime.js with detailed MAL data. Use `getAnime(slug)` for basic info + theme, `getMal(slug)` for extended metadata. Both use the same slug keys.
- **Slug consistency:** All 12 slugs must match across `anime.js`, `animeMal.js`, `cursorIcons/index.jsx`, and route params. Slugs are kebab-case: `demon-slayer`, `naruto`, `jujutsu-kaisen`, `my-hero-academia`, `attack-on-titan`, `one-piece`, `detective-conan`, `dragon-ball-z`, `fullmetal-alchemist`, `death-note`, `sword-art-online`, `tokyo-ghoul`.
- **Theme IDs:** Each anime has a `theme.id` (embers, leaf, cursed, comic, walls, voyage, mystery, saiyan, alchemy, shinigami, virtual, ghoul) used to index cursor icons and motif variants. Must be unique per anime.

## CSS Utilities & Animations

**Custom utilities in `src/index.css`:**
- `.text-stroke` — 2px stroke in `--surface` color
- `.text-stroke-white` — 2px stroke in `--surface-text` color
- `.gradient-shonen` — Sunfire gradient (gold → orange → red) with `animate-sweep`
- `.focus-ring` — Standard focus outline (only on `:focus-visible`)

**Animation keyframes:**
- `@keyframes sweep` — Background position animation for gradient text (0% → 100% background-position)
- `@keyframes float` — Subtle floating motion (translateY oscillation)
- `@keyframes pulse` — Scale pulsing (1 → 1.05 → 1)
- `@keyframes spin` — 360° rotation
- `@keyframes fadeIn` — Opacity 0 → 1
- `@keyframes slideUp` — TranslateY from bottom with fade

**Tailwind extensions in `tailwind.config.js`:**
- Custom colors: `flame`, `flameSoft`, `sun`, `sunSoft`, `chakra`, `chakraSoft`, `ki`, `kiSoft`, `sakura`, `sakuraSoft`, `ink`, `inkSoft`, `paper`, `paperSoft`
- Custom fonts: `font-display` (Orbitron), `font-jp` (Noto Sans JP), `font-pixel` (x8y12pxDenkiChip)
- Custom animations: `sweep`, `float`, `pulse` (mapped to keyframes above)

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

Accessible in Tailwind as `font-pixel`. Used for retro/pixel-style UI elements (e.g., RubikCube game UI).

## Three.js Integration

`src/lib/cubeGame.js` is a standalone Three.js Rubik's Cube game engine (~2000 lines). Key exports:
- `initGame(container)` — Initializes game in DOM container, returns game instance
- Game instance methods: `scramble()`, `reset()`, `resize()`, `destroy()`, `updatePrefs(prefs)`
- Game emits custom events: `complete`, `timer-update`, `best-time`
- Preferences: `size` (2-5), `flip` (animation style), `scramble` (length), `fov` (camera), `theme` (color scheme), `hue`/`saturation`/`lightness` (custom colors)

`src/components/RubikCube.jsx` wraps the game engine in a React component with UI controls and statistics display. Uses `useEffect` for initialization/cleanup and `useRef` for DOM/game instance references.

## MAL Data Structure

Each entry in `MAL_DATA` (from `animeMal.js`) has:
- `slug`, `malId`, `malUrl` — identifiers and link
- `titleEnglish`, `titleJapanese` — localized titles
- `synopsis`, `background` — long-form text
- `info` object with: `type`, `episodes`, `status`, `aired`, `season`, `duration`, `rating`, `score`, `scoredBy`, `rank`, `popularity`, `members`, `favorites`, `source`, `studios[]`, `producers[]`, `licensors[]`, `genres[]`, `themes[]`, `demographics[]`
- `openings[]`, `endings[]` — theme song titles
- `related[]` — related anime entries with `relation` and `malId`

Use `getMal(slug)` to retrieve. Display on `AnimeDetail` pages for extended information beyond `anime.js` basics.

## opencode environment

`.opencode/skills/ui-ux-pro-max/` is a local skill (loadable via the `skill` tool with name `ui-ux-pro-max`) that scores designs/colors/typography. There is no `opencode.json` and no other instruction files.
