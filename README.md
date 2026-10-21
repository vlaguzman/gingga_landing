# GINGGA

Marketing site, login and workspace app for GINGGA, built with Next.js (App Router), React 19 and TypeScript. Styling is hand-written CSS (no Tailwind, no UI libraries).

## Stack

- Next.js 16, React 19, strict TypeScript, App Router with a `src/` directory
- `next/font/local` (DM Sans) and `next/image`
- Plain CSS, scoped per area (see below)
- Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`) with a session proxy (`src/proxy.ts`)
- Drizzle ORM on Postgres (Supabase) through the pure-JS `postgres` client
- Vitest, Testing Library and jsdom for tests

## Commands

```bash
npm install
npm run dev            # development server on http://localhost:3000
npm run typecheck      # tsc --noEmit
npm run build          # production build (webpack, see Deploy); needs DATABASE_URL
npm start              # serve the production build (PORT env var supported)
npm test               # run all tests once (vitest run)
npm run test:watch     # tests in watch mode
npm run test:coverage  # tests plus coverage thresholds (what CI runs)
npm run db:generate    # generate a SQL migration from src/db/schema.ts into drizzle/
npm run db:migrate     # apply pending migrations to DATABASE_URL
npm run db:push        # push the schema straight to DATABASE_URL (dev only, no migration file)
npm run db:studio      # open Drizzle Studio
npm run db:seed        # insert the dev brand and user profile (scripts/seed.mjs)
```

## Environment

Copy `.env.example` to `.env.local` and fill it in. `.env.*` is git-ignored except `.env.example`. Never commit real values. Variable names the code reads:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: public, inlined at build time (`src/lib/supabase/server.ts`, `src/lib/supabase/proxy.ts`).
- `DATABASE_URL`: server-only Postgres connection string (`src/db/index.ts`, `drizzle.config.ts`, `scripts/seed.mjs`).

`DATABASE_URL` must also be set when building. `src/db/index.ts` throws "DATABASE_URL is not set" when it is imported without it. The `(app)` layout imports `src/lib/auth.ts`, which imports `src/db`, so `npm run build` fails while collecting page data for the workspace routes (first reported as `/integrations`: "Failed to collect page data for /integrations"). Set it in `.env.local` locally and in the Hostinger panel.

Note: `.env.example` may still list an older public key name; the code reads `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Structure

```
src/
  proxy.ts                session proxy entry (refreshes Supabase session, route guards)
  app/
    layout.tsx            root html/body, font, metadata
    globals.css           landing styles (applies to every route)
    error.tsx             error boundary
    not-found.tsx         404 page
    (marketing)/          landing and sector pages
    (auth)/login/         login page, server actions (login, logout), login.css
    (app)/                workspace (chats, leads, pipeline, ...), scoped in app.css
  components/
    landing/              marketing sections
    app/                  workspace shell, panels and views
  data/                   typed fixtures (the workspace UI still renders these)
  db/                     Drizzle client (index.ts) and schema (schema.ts)
  lib/
    auth.ts               requireUser(): verified user plus app profile
    supabase/             server.ts (per-request client), proxy.ts (updateSession)
    ...                   pure helpers (tabs, demo, video-assets)
  test/app.helper.tsx     shared render harness for workspace component tests
  **/*.test.ts(x)         tests colocated next to their sources
drizzle/                  generated SQL migrations and snapshots
scripts/seed.mjs          dev seed
vitest.config.mts         test projects and coverage thresholds
vitest.setup.ts           jest-dom matchers and cleanup (jsdom project)
.github/workflows/        test.yml, migrate-prod.yml
public/                   static assets
```

## Auth

Sign-in is a server action (`src/app/(auth)/login/actions.ts`) that calls `signInWithPassword`. `src/proxy.ts` runs `updateSession` from `src/lib/supabase/proxy.ts` on every non-static request: it refreshes the session cookies, redirects signed-out visitors from workspace routes to `/login` and signed-in users from `/login` to `/today-dashboard`. The proxy is only an optimistic guard; `(app)/layout.tsx` calls `requireUser()` (`src/lib/auth.ts`), which verifies the user with `getUser()` and loads the profile from the database. Details in `.claude/skills/supabase-auth-ssr`.

## Database

Drizzle schema lives in `src/db/schema.ts` (brands, users, campaigns, leads, messages; RLS enabled). `users.id` is the Supabase `auth.users` id. Workflow: edit the schema, run `npm run db:generate`, review the SQL in `drizzle/`, apply with `npm run db:migrate`. After the first migration, create a Supabase Auth user, put its uid in `scripts/seed.mjs` and run `npm run db:seed`. The workspace views still render the fixtures in `src/data/app`; only the signed-in user and profile come from the database today.

## Testing

Vitest runs two projects: `*.test.ts` in node (lib, db, proxy, actions) and `*.test.tsx` in jsdom (components, pages) with Testing Library. Tests sit next to the file they cover. Workspace component tests import `src/test/app.helper.tsx` (`renderInApp`) first, which mocks `next/navigation`, `next/link` and the login actions. Coverage thresholds (lines/statements/functions 80, branches 70) are enforced by `npm run test:coverage`.

## CI

- `test.yml` (pull requests and pushes to `main`): `npm ci`, `npm run typecheck`, `npm run test:coverage`.
- `migrate-prod.yml` (push to `main` touching `drizzle/**`, or manual dispatch): runs `npm run db:migrate` against the `PROD_DATABASE_URL` repository secret. Production migrations run in CI, not on the host.

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
- Environment variables in the panel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `DATABASE_URL` (the build fails without it)

The host has an old glibc, so native SWC and `sharp` cannot load and Next falls back to WASM. That is why the build uses webpack (Turbopack needs native bindings), the config is `next.config.mjs` (a TypeScript config fails to load) and images are unoptimized. Before pushing, run `npm run typecheck`, `npm test`, `npm run build` and `NEXT_TEST_WASM=1 npm run build`. Details in `.claude/skills/hostinger-deploy`.
