@AGENTS.md

## CSS scoping (landing vs app)

- `src/app/globals.css` (landing) is imported by the root layout, so it applies to EVERY route, including the `(app)` workspace. `src/app/(app)/app.css` is scoped under `.app`; `globals.css` is not.
- Never add generic class names (`.card`, `.tag`, `.badge`, `.summary`, `.btn`, `.chat`, `.bubble`) or bare element rules to `globals.css` without checking `src/app/(app)/app.css` and `src/components/app` for the same names. The app already uses `card`, so the landing card is `.feature-card`.
- Give landing classes specific names (`feature-card`, `lead-card`) or scope them under a section class.
- After any change to `globals.css`, open `/today-dashboard`, `/chats` and `/outreach` and check they still look right.
