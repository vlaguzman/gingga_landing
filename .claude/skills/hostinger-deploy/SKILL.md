---
name: hostinger-deploy
description: Constraints and checklist for deploying this Next.js 16 app to a Hostinger Node.js web app (old glibc, WASM SWC fallback, webpack build, unoptimized images, DNS notes). Use when changing next.config.mjs, package.json scripts or dependencies, build/start settings, environment variables on the host, or when a Hostinger build or domain misbehaves.
---

# Deploying to Hostinger (Node.js web app)

All facts below were verified in this project. Do not extend them with guesses; test on the host.

## Host constraints and what they force
| Constraint | Consequence in this repo |
|---|---|
| Old glibc: native `@next/swc` and `sharp` fail to load | Next falls back to WASM SWC. Images cannot be optimized. |
| WASM bindings do not support Turbopack (`node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md`) | `package.json` `"build": "next build --webpack"`. Never change it to plain `next build` or `--turbopack`. |
| TS config fails to load on the host | Config stays `next.config.mjs` (JSDoc `@type {import("next").NextConfig}`). Do not rename to `.ts`. |
| `sharp` unusable | `images: { unoptimized: true }` in `next.config.mjs`. Do not remove it. |
| Next 16 needs Node >= 20.9 | Select Node 20.x in the panel. (`package.json` engines is `>=20`.) |

## Panel settings
- Build command: `npm run build`
- Output directory: `.next`
- Start command: `npm start` (honours the `PORT` env var)
- Branch: `main`
- Node: 20.x

## Rules
1. Keep `next.config.mjs` plain JS; any new option must work without native binaries. WHY: the host cannot load TS config.
2. Do not add dependencies with native binaries (`sharp` is the known failure; check any package that ships `.node` or per-platform binaries) without testing a real deploy first. Prefer pure-JS/WASM packages. WHY: old glibc breaks them at build or start.
3. Do not add a custom `webpack` config casually: the build already runs under webpack, but a plugin that needs native code will fail on the host.
4. Environment variables are set in the Hostinger panel, never committed. Document names only, never values. `NEXT_PUBLIC_*` values are inlined at build time (`02-guides/environment-variables.md`), so they must exist in the panel BEFORE the build runs and need a rebuild when changed. Server-only variables are read at runtime.
5. `.env.local` is local only. Do not rely on it for production behaviour.
6. `allowedDevOrigins` in `next.config.mjs` is dev-only; leave it.
7. Use `next/image` as today: `unoptimized` means files in `public/assets/` are served as-is, so compress them before committing (mp4/jpg/png sizes matter).
8. Dependency or Next upgrades are a deploy risk: re-run the full pre-push checklist and deploy to check.

## Pre-push checklist
```bash
npm run typecheck
npm run build                    # real build, webpack
NEXT_TEST_WASM=1 npm run build   # simulates the WASM SWC fallback used on Hostinger
```
All three must pass before pushing to `main` (a push to `main` triggers the host build). After `NEXT_TEST_WASM=1`, run a normal `npm run build` again if you plan to start locally.

## DNS and domain notes
- The domain uses Hostinger nameservers (dns-parking). Apex record is an ALIAS `@ -> gingga.com.cdn.hstgr.net`.
- After nameserver changes, public resolvers may serve stale answers for a while. Check:
  - `dig +short A gingga.com @8.8.8.8`
  - `curl --resolve gingga.com:443:<ip> https://gingga.com/ -I` (use the IP returned by the check) to test the site before DNS settles.
- Do not "fix" DNS by editing the repo; it is panel-side.

## Troubleshooting pointers
- Build fails with SWC/native load errors: a new dependency pulled a native binary (rule 2).
- Build fails mentioning Turbopack/bindings: the build script lost `--webpack`.
- Config load error: `next.config` was renamed to `.ts`.
- Missing Supabase/public values in the browser after deploy: `NEXT_PUBLIC_*` was set after the build; rebuild.

Related: `nextjs-app-router` (config and env rules), `supabase-auth-ssr` (env var names).
