# ScaleLab Frontend

Next.js frontend for ScaleLab.

## Features

- Dashboard and performance visualizations
- System architecture builder
- Simulation controls and traffic visualizer
- Playground canvas with live metrics
- Authentication pages (login/signup)

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4

## Environment

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

## Install and run

```bash
npm install
npm run dev
```

Default URL: `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Main source layout

- `app/` (routes/pages)
- `components/` (UI and feature components)
- `hooks/` (custom hooks)
- `services/` (API/service layer)
- `types/` (TypeScript models)
