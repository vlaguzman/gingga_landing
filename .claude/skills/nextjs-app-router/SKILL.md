---
name: nextjs-app-router
description: Next.js 16 App Router conventions for the GINGGA repo (route groups, server vs client components, server actions, metadata, fonts, images, proxy, caching). Use when creating or editing anything under src/app/, adding a route, layout, page, server action, metadata, next.config.mjs, or a proxy file.
---

# Next.js App Router (this repo, Next 16.3)

## When to use
Any change under `src/app/**`, `next.config.mjs`, or a new `proxy.ts`. AGENTS.md says this Next has breaking changes: read the local docs first, never answer from memory.

## Before writing code (checklist)
1. Find the doc: `node_modules/next/dist/docs/01-app/` (`01-getting-started`, `02-guides`, `03-api-reference/{03-file-conventions,04-functions,05-config}`).
2. Read the page for the API you are about to use (e.g. `03-api-reference/04-functions/cookies.md`).
3. Check the version-16 upgrade notes: `02-guides/upgrading/version-16.md`.
4. Decide the route group (below) and whether the component needs `"use client"` at all.

## Version-16 changes that matter here
- `middleware.ts` is deprecated and renamed `proxy.ts` (export `proxy` or default). It runs on Node.js; `runtime` config is not allowed in it. No proxy exists yet in this repo. Ref: `01-getting-started/16-proxy.md`.
- `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` are async only (sync access removed). Always `await`.
- `revalidateTag(tag)` needs a second argument (`'max'`); use `updateTag` inside Server Actions for read-your-writes.
- Turbopack is the default for `next dev` and `next build`; this repo builds with `--webpack` (see `hostinger-deploy`).
- Local images with query strings need `images.localPatterns` config; `imageSizes` no longer includes 16.

## Rules
1. Route groups, not folders in the URL: `src/app/(marketing)/` (public landing, `layout.tsx` adds Header/Footer), `src/app/(app)/` (workspace, wraps `<AppShell>`, `noindex`), `src/app/(auth)/login/`. WHY: each group has its own chrome and CSS.
2. New route goes in the group that owns its chrome. Marketing pages: `src/app/(marketing)/<slug>/page.tsx`. Workspace pages: `src/app/(app)/<route>/page.tsx` that only renders a view (`return <ChatsView />`). Keep pages thin; logic lives in `src/components/**`.
3. Root `src/app/layout.tsx` is the only `<html>/<body>`. Do not add another root layout: `(marketing)/page.tsx` shares it, and multiple root layouts cause full page reloads (`route-groups.md`).
4. Server Components by default. Add `"use client"` only to the leaf that needs state, effects or browser APIs (e.g. `LoginForm.tsx`, `DemoSelector.tsx`). Never mark a page or layout `"use client"`.
5. Server actions live in a colocated `actions.ts` starting with `"use server"` (see `src/app/(auth)/login/actions.ts`). Client components import them; they cannot be defined inside client files. WHY: Next docs, `07-mutating-data.md`.
6. Action shape: `(prevState, formData) => Promise<State>` for `useActionState`, where `State = { error?; fieldErrors?; <echoed fields> }`. Validate every field on the server and return field errors; never trust client validation.
7. `redirect()` throws: call it outside any `try/catch`, after validation (`redirect.md`).
8. Server Functions are reachable by direct POST. Once real auth exists, verify the user inside every action (see `supabase-auth-ssr`).
9. Metadata: export `metadata` from `page.tsx`/`layout.tsx`. Root layout holds site title; `(app)/layout.tsx` uses `title.template: "%s · GINGGA"` and `robots: noindex`, so app pages only set `{ title: "Chats" }`. Auth and workspace pages must stay `noindex`.
10. Fonts: only via `next/font/local` in `src/app/layout.tsx` (DM Sans, `variable: "--font-dm-sans"`). Consume the CSS variable, never `@font-face` or a CDN link.
11. Images: `next/image` with explicit `width`/`height` (and `priority` above the fold, as in the login logo). Files go in `public/assets/`. `images.unoptimized: true` is set in `next.config.mjs`, so no resizing happens: ship already-sized assets.
12. Caching: `cacheComponents` is NOT enabled, so the previous caching model applies (`02-guides/caching-without-cache-components.md`): `fetch` is not cached unless `cache: 'force-cache'`. Using `cookies()`/`headers()` makes a route dynamic.
13. Layout auth checks do not re-run on client navigation (partial rendering). When auth lands, check close to the data (page/action/data layer), not only in `(app)/layout.tsx`. Proxy is for optimistic redirects only (`02-guides/authentication.md`).
14. Env vars: only `NEXT_PUBLIC_*` reaches the browser and is inlined at build time (`02-guides/environment-variables.md`). Never read secrets in client components.
15. Add `loading.tsx`, `error.tsx` (client component), `not-found.tsx` per segment as needed; none exist yet. `error.tsx` does not catch root-layout errors; that needs `global-error.tsx` with its own `<html>/<body>`.

## Do / Don't
```tsx
// Do: thin page, metadata, view does the work (src/app/(app)/chats/page.tsx)
export const metadata: Metadata = { title: "Chats" };
export default function Page() { return <ChatsView />; }
```
```tsx
// Don't (v16): sync request APIs
const c = cookies();            // wrong
const c = await cookies();      // right
```

## Verification
- `npm run typecheck` then `npm run build` (webpack). Run `npx next typegen` if you need `PageProps<'/route'>` helpers.
- Open the route in `npm run dev`; for CSS-affecting changes follow `css-scoping`.
- Related skills: `react-typescript-components`, `supabase-auth-ssr`, `css-scoping`, `hostinger-deploy`.
