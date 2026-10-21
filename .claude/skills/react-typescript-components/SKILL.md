---
name: react-typescript-components
description: How components, views, typed data fixtures and helpers are organised and typed in the GINGGA repo (React 19, strict TypeScript, "@/..." imports). Use when creating or editing files in src/components/landing, src/components/app, src/components/app/views, src/data, src/db, src/lib or src/test, when writing a *.test.ts(x) file, or when adding props, types, state or interactive UI.
---

# React + TypeScript components (this repo)

## When to use
Writing or refactoring any `.tsx`/`.ts` under `src/components`, `src/data`, `src/lib`. For routing/server-action questions use `nextjs-app-router`; for styling use `css-scoping`.

## Layout of the code
- `src/components/landing/*.tsx`: one file per marketing section (`Hero`, `Services`, `BenefitCards`). Server components unless they need state (`DemoSelector`, `Header`, `DemoVideo`, `HeroVideo` are `"use client"`).
- `src/components/app/*.tsx`: workspace pieces. `AppShell.tsx` (client; chrome, nav, chat panel) and `AppProvider.tsx` (client; context with all simulated state, `useApp()` hook that throws outside the provider).
- `src/components/app/views/<Name>View.tsx`: one view per workspace route; `src/app/(app)/<route>/page.tsx` only renders it.
- `src/data/app/*.ts`: typed fixtures (`LEADS`, `DEALS`, `NAV`, `STAGES`). All domain types live in `src/data/app/types.ts`. The workspace UI (`AppProvider` and the views) still renders these fixtures; nothing in `src/components` imports `src/db`.
- `src/db/{index,schema}.ts`: Drizzle client and tables. Server-only; used by `src/lib/auth.ts` (profile lookup) and the seed/migrations, never from a `"use client"` file. Do not mix `src/db` row types with `src/data/app/types.ts` fixture types; map rows to UI types in a server page when real data replaces a fixture.
- `src/lib/*.ts`: pure helpers with no React (`tabs.ts`, `demo.ts`, `video-assets.ts`), plus server helpers `auth.ts` (`requireUser`) and `supabase/*`.
- `AppShell` takes `user: { name, email }` from `(app)/layout.tsx` (via `requireUser()`); `AppProvider` derives `initials` and exposes `user` through `useApp()`. The sidebar user menu submits `<form action={logout}>` (server action from `(auth)/login/actions`).

## Rules
1. `strict` is on (`tsconfig.json`). No `any`, no `@ts-ignore`, no non-null `!` to silence errors; narrow instead. WHY: types are the only test net in this repo.
2. Import with the alias `@/*` -> `src/*` across folders (`@/data/app/types`); use `./` only for siblings in the same folder.
3. Name exports: components `PascalCase` named exports (no default except Next special files: `page`, `layout`). Views end in `View`, data constants are `UPPER_SNAKE` (`LEADS`), types/interfaces `PascalCase`, ids are string unions (`SectionId`, `StageId`).
4. Model closed sets as string-literal unions and key lookup tables by them: `Record<ViaId, {...}>` in `src/data/app/chips.ts`, `readonly SectorId[]` for fixed order. Prefer a discriminated union (`{ kind: "ok"; ... } | { kind: "error"; ... }`) over optional-field bags when states are mutually exclusive.
5. Props: inline `type Props = {...}` above the component (see `DemoSelector`) or inline in the signature for one or two props (`BenefitCards`). Use `readonly` arrays for list props. Use `ReactNode` for children.
6. Types for domain data go in `src/data/app/types.ts`; fixtures import from it, never the reverse. Add a one-line TSDoc on non-obvious fields (see `PersonProfile`).
7. Server component first. Add `"use client"` only when you need state, effects, refs or event handlers, and keep the client part a small leaf. WHY: bundle size and `nextjs-app-router` rule 4.
8. Derive, do not sync: compute values during render from props/state (`leads.find(...)` in `LeadsView`) instead of copying into state plus `useEffect`. Reserve `useEffect` for subscriptions to the outside world with cleanup (`document.addEventListener` in `AppShell`).
9. Keys must be stable ids (`key={l.id}`, `key={item.title}`), never array index for reorderable lists.
10. Shared state: app-wide simulated state goes through `useApp()` (context in `AppProvider`). Do not prop-drill more than one level; do not create a second context without reason.
11. Container/presentational: when a component both fetches or mutates data and renders markup, split it. Container (server component or hook) loads data and validates; presentational component receives typed props and renders. Today views read the fixtures via `useApp()`; when real data arrives, fetch in the server page (after `requireUser()`, filtered by `brandId`) and pass typed props down, keep views presentational.
12. Pure logic with no React goes in `src/lib` (e.g. `nextTabIndex`) so it is testable and reusable.
13. Copy and identifiers are English; user-facing strings stay in the component or data file, not scattered in CSS.

## Testing conventions
- Colocate: `Foo.tsx` -> `Foo.test.tsx` next to it; `*.ts` logic -> `*.test.ts`. `vitest.config.mts` runs `*.test.ts` in the `node` project and `*.test.tsx` in `dom` (jsdom + `vitest.setup.ts` with jest-dom and `cleanup`). Use the right extension or the test runs in the wrong environment.
- Workspace components: `import { renderInApp, ... } from "@/test/app.helper"` BEFORE the component under test (it registers the `next/navigation`, `next/link` and `@/app/(auth)/login/actions` mocks). `renderInApp(ui, { path, user })` wraps in `AppProvider`; `app()` reads live context; `advance(ms)` moves fake timers inside `act`.
- Query by role and accessible name (`getByRole`, `getByLabelText`), interact with `@testing-library/user-event`. Test ids only as a last resort. This also enforces the accessibility rules below.
- Mock only boundaries: `next/*`, `@/lib/supabase/server`, `@/lib/auth`, `@/db`, `postgres`, `@supabase/ssr`, CSS imports, heavy video components. Do not mock the code under test or `@/data/app` fixtures.
- Coverage thresholds (v8, `npm run test:coverage`, enforced in CI): lines, statements, functions 80; branches 70. `src/db/schema.ts`, `src/data/app/types.ts` and tests are excluded. New code needs tests in the same change.

## Accessibility (follow what exists)
- Semantic elements: `<section>`, `<main>`, `<ul>/<li>` for lists (`BenefitCards`), `<button type="button">` for actions, `<Link>` for navigation. No clickable `div`s.
- Every icon-only button has `aria-label` (and optional `title`), e.g. discard button in `LeadsView`; decorative SVGs use `aria-hidden="true"` (`landing/Icon.tsx`).
- Form fields: `<label htmlFor>` + `id`, `aria-invalid` and `aria-describedby` pointing at an error `<p role="alert">` (`LoginForm.tsx`). Set `autoComplete`.
- Tabs follow the ARIA tablist pattern with roving focus via `nextTabIndex` (`DemoSelector`). Loading placeholders use `role="status"` with `aria-label`.
- Keep a visible focus style; do not remove outlines (landing has `.btn:focus-visible`).

## Do / Don't
```tsx
// Do
import type { Lead } from "@/data/app/types";
export function LeadRow({ lead }: { lead: Lead }) { /* ... */ }

// Don't
const [filtered, setFiltered] = useState<Lead[]>([]);
useEffect(() => setFiltered(leads.filter(f)), [leads]);   // derive during render instead
```

## Checklist
- [ ] Types in `types.ts`, no `any`
- [ ] Server component unless a hook/handler is needed
- [ ] Icon buttons labelled, form fields labelled
- [ ] No new class names without checking `css-scoping`

## Verification
`npm run typecheck`, `npm test` and `npm run build` (needs `DATABASE_URL`). Related: `nextjs-app-router`, `css-scoping`, `supabase-auth-ssr`.
