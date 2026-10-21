---
name: css-scoping
description: Plain-CSS scoping rules for the GINGGA repo, where landing styles in globals.css leak into the workspace and login. Use when editing or adding CSS in src/app/globals.css, src/app/(app)/app.css or src/app/(auth)/login/login.css, naming a new class, or styling a new landing section, app view or auth page.
---

# CSS scoping (landing vs app vs auth)

Authoritative project rule: `CLAUDE.md` section "CSS scoping (landing vs app)". This skill expands it; if they ever disagree, `CLAUDE.md` wins.

## When to use
Any CSS change, or any new `className` in a component.

## How the three stylesheets load
| File | Imported by | Reaches |
|---|---|---|
| `src/app/globals.css` | `src/app/layout.tsx` (root) | EVERY route, including `(app)` and `(auth)` |
| `src/app/(app)/app.css` | `src/app/(app)/layout.tsx` | Only works because every selector starts with `.app` |
| `src/app/(auth)/login/login.css` | `src/app/(auth)/login/page.tsx` | Selectors are `.login`, `.login__*`, `.login h1` |

No Tailwind, no CSS modules, no CSS-in-JS. Plain CSS with BEM-like names.

## Rules
1. Unscoped selectors in `globals.css` are global. A bare element rule (`h2 {}`, `a {}`) or a generic class (`.card`, `.tag`, `.badge`, `.summary`, `.btn`, `.chat`, `.bubble`) can break the workspace. WHY: this already happened; the landing `.card` became `.feature-card` (commit 7629092).
2. Before adding any class run `rg -n "\.<name>\b" src/app src/components` and also check `src/app/(app)/app.css`. The workspace already defines `.app .card`, `.app .btn-ink`, `.app .sr-main`. No hit anywhere, or a hit only in the same section, is required.
3. Landing classes: specific names or scoped under a section class: `feature-card`, `lead-card`, `demo__panel`, `hero__cta`. Use BEM-ish `block__element--modifier` (`login__field`, `btn--outline`).
4. Workspace CSS: every selector under `.app` (`.app .card`), keyframes prefixed `app-` (`app-typing`, `app-spin`, `app-shimmer`). Never put workspace styles in `globals.css`.
5. Auth CSS: root block `.login` and `login__*` elements; scope element rules (`.login h1`). Reuse the shared `.btn` from `globals.css` (as `LoginForm` does) instead of redefining it.
6. Keyframes in `globals.css` need a distinctive name (`fade-in` exists); do not reuse it for another effect.
7. Tokens live on `:root` in `globals.css` (`--navy`, `--paper`, `--cyan`, `--blue`, `--violet`, `--line`, `--text-3`, `--gutter`, `--section-y`, ...). Use `var(--token)`; do not hardcode a brand colour that already has one. `app.css` aliases them as `--a-*` on `.app` (e.g. `--a-line: var(--line)`); add new workspace-only values there. Add a new global token only if landing needs it.
8. Font: `font-family: var(--font-dm-sans), "Helvetica Neue", Helvetica, Arial, sans-serif` (variable set by `next/font` in `src/app/layout.tsx`).
9. Layout primitives already exist: `.container`, `.section`, `.section--dark`, `.stack-48`, `.h2`, `.lead`, `.section-title`. Compose them before writing new spacing.
10. Responsive: hand-written `@media (max-width: 880px)` / `(min-width: 900px)` in landing, `(max-width: 860px)` in app. Write fluid values with `clamp()` and tokens (`--gutter`, `--section-y`). Test narrow widths.
11. Motion: wrap landing animations in `@media (prefers-reduced-motion: no-preference)` (smooth scroll, `fade-in`); `app.css` has a global `prefers-reduced-motion: reduce` override under `.app`. New motion must respect one of them.
12. Focus: keep `:focus-visible` styles (`.btn:focus-visible`); never `outline: none` without a replacement.

## Add a new landing section (safe recipe)
1. Pick a unique block name, e.g. `.pricing`, and `rg` it (rule 2).
2. Component root: `<section className="section pricing">`, children `pricing__title`, `pricing__card`.
3. Append CSS to `globals.css` near related sections, all selectors starting with `.pricing`.
4. Use tokens and `.container`; add the mobile `@media` block.

## Verification (required after ANY change to globals.css)
1. `npm run dev`, then open `/today-dashboard`, `/chats` and `/outreach` and confirm they look unchanged (cards, buttons, headings, spacing). Also open `/login` and `/`.
2. `rg -n "^(h[1-6]|p|a|ul|li|button|input|section|main)\b" src/app/globals.css` to spot bare element rules you added.
3. `npm run build`.

Related: `nextjs-app-router` (where CSS is imported), `react-typescript-components`.
