# AGENTS.md

Anime-themed showcase site. Vite + React 18 (JSX), plain Tailwind, framer-motion, react-router-dom v6. **No** TypeScript, Next.js, or shadcn — do not introduce them.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build (also the project's only verification step; there is no test, lint, typecheck, or CI)
- `npm run preview` — preview the build

After changes, run `npm run build` to verify.

## Layout

- `src/main.jsx` — synchronous IIFE applies `light`/`dark` class to `<html>` from `localStorage` **before** `createRoot.render`. Do not move theme init into React or you will reintroduce a flash.
- `src/App.jsx` — `BrowserRouter` → `CursorThemeProvider` → `Cursor` + `Loader` + `ParticleField` + `Navbar` + `AnimatedRoutes` (`AnimatePresence mode="wait"`) + `Footer`. Routes: `/`, `/anime/:slug`, `*` (404).
- `src/data/anime.js` — `ANIME` array + `getAnime(slug)`. 6 entries with `theme {id, bg, grad, kanji, ...}`. Keys: `demon-slayer`, `naruto`, `jujutsu-kaisen`, `my-hero-academia`, `attack-on-titan`, `one-piece`.
- `src/data/animeMal.js` — 54 KB MAL detail data. **Auto-generated** from `/tmp/jikan_fetch/result.json` via Python. Do not hand-edit. Exports `MAL_DATA` + `getMal(slug)`.
- `src/context/CursorThemeContext.jsx` — `useCursorTheme()`, `buildCursorThemeFromAnime(anime)`, `DEFAULT_CURSOR_THEME`. `AnimeDetail` calls `setTheme(...)` on mount and `resetTheme()` on cleanup.
- `src/hooks/usePrefersReducedMotion.js`, `src/hooks/useTheme.js` — both default exports, both return reactively via `MutationObserver`/`matchMedia`.

Image assets are remote (`cdn.myanimelist.net`). There is no `public/` or local image pipeline.

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

## opencode environment

`.opencode/skills/ui-ux-pro-max/` is a local skill (loadable via the `skill` tool with name `ui-ux-pro-max`) that scores designs/colors/typography. There is no `opencode.json` and no other instruction files.
