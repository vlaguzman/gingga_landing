# GINGGA Landing

Sales landing page for GINGGA, built with Next.js (App Router), React 19 and TypeScript. Styling is hand-written CSS (no Tailwind, no UI libraries). The app is structured to grow a login and dashboard later.

## Stack

- Next.js 16, React 19, TypeScript
- App Router with a `src/` directory
- `next/font/local` (DM Sans) and `next/image`
- Plain CSS in `src/app/globals.css`

## Commands

```bash
npm install
npm run dev     # development server on http://localhost:3000
npm run build   # production build
npm start       # serve the production build (PORT env var supported)
```

## Structure

```
src/
  app/
    layout.tsx            root html/body, font, metadata
    globals.css           all styles
    icon.png              favicon
    fonts/                DM Sans woff2
    (marketing)/page.tsx  landing page (route group)
  components/landing/     server components, one per section
public/assets/            logo.png, mark.png
```

Future areas (login, dashboard) go in their own route groups, e.g. `src/app/(app)/dashboard`.

## Deploy on Hostinger

Node.js web app settings:

- Node version: 22
- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm start`
