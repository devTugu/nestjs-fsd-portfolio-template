# Production Deployment Guide

## Prerequisites

- Node.js 18+
- MySQL 8
- Redis 7 (required when `REDIS_ENABLED=true`)
- Docker and Docker Compose (optional)

## Environment

Copy [`.env.example`](../.env.example) to `.env` and set:

| Variable | Production |
|----------|------------|
| `NODE_ENV` | `production` |
| `SWAGGER_ENABLED` | `false` |
| `REDIS_ENABLED` | `true` |
| `REDIS_URL` | Redis cluster URL |
| `JWT_*_SECRET` | Strong random strings (32+ chars); rotate periodically |
| `DB_SSL` | `true` when provider requires TLS |
| `CORS_ORIGIN` | Your frontend origin |

## Docker Compose

```bash
docker compose up -d --build
```

The entrypoint runs migrations before starting the app ([`scripts/docker-entrypoint.sh`](../scripts/docker-entrypoint.sh)).

## Startup order (manual deploy)

1. `npm ci`
2. `npm run build`
3. `npm run migration:run:prod` (or `migration:run` in dev)
4. `npm run seed` (first deploy only, or when resetting RBAC)
5. `npm run start:prod`

## Health probes

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/health/live` | Process alive |
| `GET /api/v1/health/ready` | Database (+ Redis when enabled) |

Use `/ready` for load balancer and Kubernetes readiness checks.

## Scaling

- Run multiple app instances behind a load balancer.
- Keep `REDIS_ENABLED=true` so token blacklist and permission cache are shared.
- Do not use `REDIS_ENABLED=false` outside single-process local dev.

## Observability

OpenTelemetry is prepared in [`src/infrastructure/observability/tracing.ts`](../src/infrastructure/observability/tracing.ts).

Set `OTEL_ENABLED=true` and extend `initTracing()` with your SDK exporter when connecting to a collector. Full SDK packages are not bundled in this template to keep dependencies minimal.

## Verification

Before promoting a release:

```bash
npm ci && npm run lint && npm run migration:run && npm test -- --coverage && npm run test:e2e && npm run build
```

## Local development

XAMPP MySQL example:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=portfolio_db
APP_PORT=3001
```

Without Redis:

```
REDIS_ENABLED=false
```

## Railway

Railway is a common deploy target for portfolio client projects.

### Service setup

1. Create a **NestJS service** from this repo
2. Add **MySQL** and **Redis** plugins (or external providers)
3. Set variables (reference syntax):

```
NODE_ENV=production
SWAGGER_ENABLED=false
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_SSL=false
REDIS_ENABLED=true
REDIS_URL=${{Redis.REDIS_URL}}
CORS_ORIGIN=https://your-frontend.up.railway.app
JWT_ACCESS_SECRET=<openssl rand -base64 32>
JWT_REFRESH_SECRET=<openssl rand -base64 32>
```

Railway injects `PORT` automatically — do **not** set `APP_PORT` in production.

### First deploy

Run migrations and seed once (Railway shell or one-off job):

```bash
npm run migration:run:prod
npm run seed
```

### Portfolio-specific notes

| Topic | Guidance |
|-------|----------|
| Images | Use Cloudinary / R2 / S3 URLs in CMS fields. Local uploads are lost on redeploy. |
| S3 upload | Optional — set `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_PUBLIC_BASE_URL` |
| Contact email | Set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_NOTIFY_EMAIL` |
| Demo content | Seed includes sample projects/skills — replace via admin CMS or re-seed on fresh DB |
