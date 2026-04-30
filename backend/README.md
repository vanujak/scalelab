# ScaleLab Backend

NestJS backend service for ScaleLab.

## Features

- User authentication endpoints (including Google login flow)
- System modeling endpoints
- Simulation APIs with scheduling/cache algorithms
- Metrics APIs
- Playground persistence APIs

## Tech stack

- NestJS 11
- TypeScript
- PostgreSQL (`pg`)

## Environment

Create `backend/.env` with at least:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

## Install and run

```bash
npm install
npm run start:dev
```

Default port: `4000`.

## Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run start:prod
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

## Main source layout

- `src/modules/users/`
- `src/modules/systems/`
- `src/modules/simulation/`
- `src/modules/metrics/`
- `src/modules/playgrounds/`
- `src/database/`
