---
name: supabase-auth-ssr
description: How Supabase auth is implemented in this Next.js 16 repo with @supabase/ssr 0.12 and supabase-js 2.118 (session proxy, per-request server client, requireUser, server-action login/logout, env vars, route protection). Use when touching src/proxy.ts, src/lib/supabase/*, src/lib/auth.ts, src/app/(auth)/login/actions.ts, protecting a route or action under src/app/(app), or any Supabase env var.
---

# Supabase auth (SSR) in GINGGA

## How it works here
| Piece | File | Role |
|---|---|---|
| Proxy entry | `src/proxy.ts` | `export async function proxy(request)` calls `updateSession`. `config.matcher` skips `_next/static`, `_next/image`, `favicon.ico` and static image/video extensions. |
| Session refresh + guard | `src/lib/supabase/proxy.ts` | `updateSession(request)`: builds a `createServerClient` on request/response cookies, calls `supabase.auth.getUser()`, redirects. |
| Server client | `src/lib/supabase/server.ts` | `createClient()` (async): `createServerClient` over `await cookies()`; `setAll` wrapped in `try/catch` because Server Components cannot write cookies. |
| Verified user | `src/lib/auth.ts` | `requireUser()` wrapped in React `cache`: `getUser()`, then loads the profile from `users` (Drizzle). Returns `{ id, email, name, brandId }`. |
| Login / logout | `src/app/(auth)/login/actions.ts` | Server actions `login(prev, formData)` and `logout()`. UI: `LoginForm.tsx` with `useActionState`. |
| Workspace | `src/app/(app)/layout.tsx` | `await requireUser()`, passes `{ name, email }` to `AppShell`; sidebar has a `<form action={logout}>`. |

There is no browser client: no `createBrowserClient` file exists and nothing needs one.

## Proxy behaviour
- Protects by prefix list `PROTECTED_PREFIXES` in `src/lib/supabase/proxy.ts`: `/today-dashboard`, `/chats`, `/leads`, `/outreach`, `/pipeline`, `/playbook`, `/integrations` (exact or `prefix/...`). Signed out: redirect to `/login`. Signed in on `/login`: redirect to `/today-dashboard`.
- It is optimistic only (its own comment says so). The security boundary is `requireUser()` plus tenant filters.
- Do not run code between `createServerClient` and `getUser()` in `updateSession`.

## Login and sign out
- `login` trims the email, checks `EMAIL_PATTERN` and password length >= 8, returns `{ fieldErrors, email }` on failure (never the password).
- Then `supabase.auth.signInWithPassword`; on error returns the generic `"Invalid email or password."` (no account enumeration); on success `redirect("/today-dashboard")` outside any `try/catch`.
- `logout` calls `supabase.auth.signOut()` then `redirect("/login")`.
- `requireUser()` signs out and redirects if the auth user has no `users` row (no brand, no access).

## Rules
1. Create a NEW server client per request/action/render via `createClient()`; never cache it at module level.
2. Cookie adapter implements `getAll` and `setAll` only (`get/set/remove` is deprecated). `cookies()` is async in Next 16.
3. Identity on the server is `getUser()` (validated by the Auth server). Never trust `getSession()` for authorization: its user is unverified with cookie storage (auth-js types say so). This repo uses `getUser()` everywhere; `getClaims()` is not used.
4. Call `requireUser()` close to the data (pages, actions, data fetchers), not only in the layout: layouts do not re-run on client navigation, and Server Functions accept direct POSTs.
5. Every tenant query filters by the returned `brandId`.
6. Validate again on the server; the client form is UX only.
7. Only the project URL and publishable key are `NEXT_PUBLIC_*`. Never put a service-role key in `NEXT_PUBLIC_*` or a `"use client"` file; an admin client would need `import "server-only"`.
8. Row Level Security is enabled on all tables in `src/db/schema.ts`; it is the real control for anything reached with the publishable key.

## Env var names (names only)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: read with `!` in `server.ts` and `proxy.ts` (no missing-value guard; a missing value fails at the first Supabase call).
- `DATABASE_URL`: used by `src/db/index.ts` (throws at import when missing). `NEXT_PUBLIC_*` is frozen at build time; rebuild after changing it.
- `.env.*` is git-ignored except `.env.example`.

## Checklist: new protected route or action
- [ ] Route: add its prefix to `PROTECTED_PREFIXES` in `src/lib/supabase/proxy.ts` and its test in `proxy.test.ts`.
- [ ] Page/action/data function calls `await requireUser()` and uses `brandId` in queries.
- [ ] Action: `"use server"` in a colocated `actions.ts`, validate input, generic error text, `redirect()` outside `try/catch`.
- [ ] Mutating action never relies on the proxy or the layout for auth.
- [ ] Tests mock `@/lib/supabase/server` and `@/lib/auth` (see `actions.test.ts`, `auth.test.ts`, `layout.test.tsx`).

## Verification
- `rg -n "SERVICE_ROLE|service_role" src` returns nothing; `git status` shows no `.env*` other than `.env.example`.
- `npm run typecheck`, `npm test`; in `npm run dev` log in, reload `/today-dashboard` signed out (redirect), sign out from the sidebar.
- Related: `nextjs-app-router` (actions, proxy), `hostinger-deploy` (env vars), `react-typescript-components` (tests).
