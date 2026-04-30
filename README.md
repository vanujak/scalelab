# ScaleLab

ScaleLab is a full-stack platform for building, simulating, and monitoring distributed system architectures.

## What is in this repository

- `frontend/`: Next.js 16 (React 19, TypeScript, Tailwind CSS v4) UI for simulation, dashboards, systems, and playground features.
- `backend/`: NestJS 11 API with modules for users, systems, simulation, metrics, and playgrounds.
- `docker-compose.yml`: Production-style multi-container setup (frontend, backend, nginx + certbot).
- `nginx.conf`: Reverse proxy and TLS routing for `scalelab.easycase.site` and `api.scalelab.easycase.site`.
- `Jenkinsfile`: CI/CD pipeline that deploys this stack using Docker Compose.

## Tech stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript, PostgreSQL (`pg`)
- Deployment: Docker Compose, Nginx, Let's Encrypt (via `jonasal/nginx-certbot`)
- CI/CD: Jenkins Pipeline

## Prerequisites

- Node.js 20+
- npm 10+
- Docker + Docker Compose
- PostgreSQL database (or managed PostgreSQL service)

## Environment variables

Create or update a root `.env` file (used by `docker compose`) with:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

Notes:

- `DATABASE_URL` is required by the backend.
- `GOOGLE_CLIENT_ID` is used by the backend in Docker/Jenkins deployment.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is exposed to the frontend.
- In Jenkins pipeline deploys, credentials are injected securely and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is exported from `GOOGLE_CLIENT_ID` during build/deploy.

## Run locally (without Docker)

### 1) Backend

```bash
cd backend
npm install
npm run start:dev
```

Default backend port: `4000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend port: `3000`.

If needed, set `NEXT_PUBLIC_API_BASE_URL` for local frontend runtime (for example `http://localhost:4000`).

## Run with Docker Compose

From the repository root:

```bash
docker compose up -d --build
```

To stop:

```bash
docker compose down
```

Current compose behavior:

- Backend runs on internal port `4000`.
- Frontend runs on internal port `3000`.
- Nginx/Certbot container exposes ports `80` and `443`.
- Nginx proxies:
  - `api.scalelab.easycase.site` -> backend
  - `scalelab.easycase.site` -> frontend

## Jenkins deployment

`Jenkinsfile` stages:

1. Checkout source
2. Deploy using `docker compose down` then `docker compose up -d --build`
3. Cleanup dangling Docker images

Required Jenkins string credentials:

- `scalelab-db-url`
- `scalelab-google-client-id`

## Useful commands

### Backend

```bash
cd backend
npm run build
npm run test
npm run test:e2e
npm run lint
```

### Frontend

```bash
cd frontend
npm run build
npm run lint
```

## Project structure

```text
.
├── backend/
├── frontend/
├── docker-compose.yml
├── nginx.conf
└── Jenkinsfile
```

## Additional docs

- Backend details: `backend/README.md`
- Frontend details: `frontend/README.md`
