---
name: supabase-auth-ssr
description: How to add and use Supabase auth with @supabase/ssr and supabase-js in this Next.js 16 repo (server vs browser client, cookies, verified user, server-action login, env vars). Use when touching src/app/(auth)/login/actions.ts, adding a src/lib/supabase file, a proxy.ts, route protection for src/app/(app), or any Supabase env var.
---

# Supabase auth (SSR) in GINGGA

## Current state (verify before assuming)
- `@supabase/ssr` 0.12.x and `@supabase/supabase-js` 2.118.x are in `package.json`, but NO Supabase client, `proxy.ts` or env read exists in `src/` yet (`rg -i supabase src` is empty).
- `src/app/(auth)/login/actions.ts` is a front-end simulation: it validates email/password shape and `redirect("/today-dashboard")`. `(app)` routes are not protected.
- Treat everything below as the target design. Package behaviour was read from `node_modules/@supabase/ssr/dist/main/*.d.ts` and `node_modules/@supabase/auth-js/dist/main/GoTrueClient.d.ts`; re-check there if unsure.

## Rules
1. Two clients, two files, never mixed. Suggested layout: `src/lib/supabase/server.ts` (`createServerClient`, async, reads `cookies()` from `next/headers`) and `src/lib/supabase/client.ts` (`createBrowserClient`). WHY: server must read/write session cookies; browser must never import `next/headers`.
2. Create a NEW server client per request/action/render. Never cache it in a module-level variable (ssr docs: "never share a client across requests").
3. Server client cookie adapter must implement BOTH `getAll` and `setAll` (the `get/set/remove` form is deprecated). Do not use `auth.storage`; it is ignored. WHY: wrong adapters cause random logouts.
4. `cookies()` is async in Next 16: `const store = await cookies()`. `setAll` can throw in Server Components (cookies are only writable in Server Functions and Route Handlers), so wrap it in `try/catch` there and let `proxy.ts` do the refresh.
5. Session refresh happens in `src/proxy.ts` (Next 16 name; NOT `middleware.ts`): create the server client from the request/response cookies, call `await supabase.auth.getClaims()` early, write refreshed cookies onto the response. Use a narrow `matcher` that excludes `_next/static`, images and `/assets`. Proxy only does optimistic redirects; it is not the authorization layer (`nextjs-app-router` rule 13).
6. Trust order on the server: `getUser()` (asks the Auth server) or `getClaims()` (verifies the JWT) for identity. NEVER use `getSession().user` for authorization: with cookie storage it is not verified (auth-js types say so). Put this in one data-access helper, e.g. `src/lib/auth/session.ts` exporting `verifySession()` wrapped in React `cache`, and call it in pages, actions and data fetchers, not only in `(app)/layout.tsx`.
7. Login stays a server action in `src/app/(auth)/login/actions.ts`: keep the existing `LoginState` return shape and field validation, then call `supabase.auth.signInWithPassword({ email, password })`. On failure return a generic `error: "Invalid email or password."`; never echo Supabase error text, user existence or status codes. On success `redirect("/today-dashboard")` OUTSIDE any `try/catch`.
8. Validate on the server every time (the client `noValidate` form is UX only). Re-check email pattern/password presence, trim email, do not log passwords, never return the password in state (existing code returns only `email`).
9. Every server action that mutates data calls `verifySession()` first; Server Functions are reachable by direct POST.
10. Sign-out is a server action calling `supabase.auth.signOut()` then `redirect("/login")`.
11. Keys: only the project URL and the anon/publishable key may be `NEXT_PUBLIC_*`. The service-role key must never be prefixed `NEXT_PUBLIC_`, never imported in `"use client"` files, never committed. If a server-only admin client is ever needed, put it in a file that starts with `import "server-only"`. WHY: `NEXT_PUBLIC_` values are inlined into browser JS at build time.
12. Env var names (names only, never values anywhere in the repo or chat): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (confirm the exact names with the owner before coding). Read them through one helper that throws a clear error if missing instead of using `!` scattered around.
13. Because `NEXT_PUBLIC_*` is frozen at build time, set them before `npm run build` on the host (see `hostinger-deploy`), and rebuild after changing them.
14. `.env.local` must never be committed. `.gitignore` currently lists `.env` but NOT `.env.local`; add `.env*.local` (ask the owner) before any real secret lands.
15. Row Level Security is the real access control for anything reached with the anon key; do not rely on UI hiding.

## Do / Don't
```ts
// Do: verified identity
const supabase = await createClient();            // src/lib/supabase/server.ts
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");

// Don't
const { data: { session } } = await supabase.auth.getSession();
if (session) { /* trusting an unverified cookie */ }
```

## Checklist
- [ ] Server vs browser client in separate files, new server client per call
- [ ] `proxy.ts` refreshes the session; matcher excludes static assets
- [ ] Verified-user helper used in pages and actions
- [ ] Generic login error, redirect outside try/catch
- [ ] No secret in `NEXT_PUBLIC_*`, `.env.local` not tracked

## Verification
- `rg -n "SERVICE_ROLE|service_role" src` returns nothing; `git status` shows no `.env*` staged.
- `npm run typecheck`, `npm run build`; log in and out in `npm run dev`; reload `/today-dashboard` signed out and confirm redirect.
- Related: `nextjs-app-router` (actions, proxy, async cookies), `hostinger-deploy` (env vars).
