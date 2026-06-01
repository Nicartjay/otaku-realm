# Otaku Realm

An anime-themed showcase site built with Vite + React 18, plain Tailwind CSS, framer-motion, and react-router-dom. Custom magnetic cursor, per-anime themed pages, light/dark mode, and a lot of animation.

## Stack

- **Vite 5** + **React 18** (JSX, no TypeScript)
- **Tailwind CSS 3** (plain — not shadcn)
- **framer-motion** for animation and scroll-driven effects
- **react-router-dom v6** for routing

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
├── index.css            # Tailwind layers + CSS-var theme tokens + utilities
├── components/          # shared UI (Cursor, Hero, FeaturedAnime, etc.)
│   ├── icons/           # local SVG icon set (UI + brand)
│   └── cursorIcons/     # per-anime cursor glyphs
├── context/             # CursorThemeContext
├── data/
│   ├── anime.js         # 6 anime entries with theme metadata
│   └── animeMal.js      # auto-generated MAL detail data (do not hand-edit)
├── hooks/               # usePrefersReducedMotion, useTheme
└── pages/               # Home, AnimeDetail
```

Routes: `/` (home), `/anime/:slug` (per-anime detail page), `*` (404).

## Notable behaviour

- **Custom cursor.** `src/index.css` sets `* { cursor: none }` globally and `src/components/Cursor.jsx` renders a 5-layer interactive cursor with a per-anime themed icon variant.
- **Light/dark theme.** Toggle in the navbar persists to `localStorage`. Theme is applied as a class on `<html>` synchronously in `main.jsx` before React mounts. CSS variables in `:root` / `html.light` redefine `--ink`, `--paper`, etc.
- **Per-anime theming.** Each anime in `data/anime.js` carries a `theme` block (`bg`, `grad`, `kanji`, `id`). `AnimeDetail` consumes it for the page background, `ThemeMotif` for decorative layers, and `CursorThemeContext` for the cursor palette.
- **Reduced motion.** `usePrefersReducedMotion()` and a global `@media (prefers-reduced-motion: reduce)` block in `index.css` neutralize animation when the user has the OS preference set. Otherwise every animation runs by default.

## Image assets

All images are remote (`cdn.myanimelist.net`). There is no `public/` directory and no local image pipeline.

## Working in this repo

See [`AGENTS.md`](./AGENTS.md) for conventions and traps that aren't obvious from the file tree (cursor system, motion-centering pattern, theme-var system, focus styles, icon rules, etc.).
