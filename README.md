# GINGGA

Marketing site, login and workspace app for GINGGA, built with Next.js (App Router), React 19 and TypeScript. Styling is hand-written CSS (no Tailwind, no UI libraries).

## Stack

- Next.js 16, React 19, strict TypeScript, App Router with a `src/` directory
- `next/font/local` (DM Sans) and `next/image`
- Plain CSS, scoped per area (see below)
- Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`) with a session proxy, and Drizzle on Supabase Postgres
- Vitest and Testing Library for tests (`npm test`)

## Commands

```bash
npm install
npm run dev        # development server on http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # production build (webpack, see Deploy)
npm start          # serve the production build (PORT env var supported)
```

## Environment

Copy `.env.example` to `.env.local` and fill it in. `.env*.local` is git-ignored. Never commit real values.

## Structure

```
src/
  app/
    layout.tsx            root html/body, font, metadata
    globals.css           landing styles (applies to every route)
    error.tsx             error boundary
    not-found.tsx         404 page
    (marketing)/          landing and sector pages
    (auth)/login/         login page, server action, login.css
    (app)/                workspace (chats, leads, pipeline, ...), scoped in app.css
  components/
    landing/              marketing sections
    app/                  workspace shell, panels and views
  data/                   typed fixtures
  lib/                    helpers
public/                   static assets
```

## CSS scoping

`globals.css` is imported by the root layout, so it applies everywhere, including the workspace. `(app)/app.css` is scoped under `.app`. Use specific class names and read [CLAUDE.md](CLAUDE.md) and `.claude/skills/css-scoping` before editing `globals.css`.

## Project skills

Best-practice skills for this stack live in `.claude/skills/`: `nextjs-app-router`, `react-typescript-components`, `supabase-auth-ssr`, `css-scoping` and `hostinger-deploy`.

## Deploy on Hostinger

Node.js web app settings:

- Framework preset: Next.js, branch `main`, root directory `./`
- Node version: 20.x (Next 16 requires `>=20.9`)
- Install: `npm install`
- Build: `npm run build` (runs `next build --webpack`)
- Output directory: `.next`
- Start: `npm start`

The host has an old glibc, so native SWC and `sharp` cannot load and Next falls back to WASM. That is why the build uses webpack (Turbopack needs native bindings), the config is `next.config.mjs` (a TypeScript config fails to load) and images are unoptimized. Before pushing, run `npm run typecheck`, `npm run build` and `NEXT_TEST_WASM=1 npm run build`. Details in `.claude/skills/hostinger-deploy`.
