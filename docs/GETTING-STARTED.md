# Getting Started

## Prerequisites

- Node.js 18+
- MySQL 8
- Redis 7 (optional; set `REDIS_ENABLED=false` for in-memory throttle/cache)
- Paired frontend: [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) v3.0.0

## Install

```bash
git clone https://github.com/devTugu/nestjs-fsd-portfolio-template.git
cd nestjs-fsd-portfolio-template
npm ci
cp .env.example .env
```

Edit `.env` — minimum required:

| Variable | Example |
|----------|---------|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3306` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | `secret` |
| `DB_NAME` | `portfolio_api` |
| `JWT_ACCESS_SECRET` | 32+ char random string |
| `JWT_REFRESH_SECRET` | 32+ char random string |
| `CORS_ORIGIN` | `http://localhost:3000` |

See [env.validation.ts](../src/infrastructure/config/env.validation.ts) for the full schema.

## Database

```bash
npm run migration:run
npm run seed
```

Migrations include v3 multi-brand changes (`1730000000010`–`1730000000012`). Migration `012` drops legacy portfolio tables.

## Run

```bash
npm run start:dev
```

API listens on `APP_PORT` (default `3000`). Set `APP_PORT=3001` when pairing with the Next.js frontend on port 3000.

Swagger (when `SWAGGER_ENABLED=true`): `http://localhost:3001/docs`

## Seed credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | `admin@example.com` | `Admin123!` | `SUPER_ADMIN` |
| Viewer | `viewer@example.com` | `Viewer123!` | `E2E_VIEWER` |

Override with `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_VIEWER_EMAIL`, `SEED_VIEWER_PASSWORD`.

## Demo content

Seed creates four demo brands (restaurant + event), menu items, events, history timeline, leadership, team, news posts, navigation tree, and site settings. Customize via `SEED_BRAND_NAME` and `SEED_CONTACT_EMAIL`.

## Verify

```bash
npm run test
npm run build
curl http://localhost:3001/api/v1/health/ready
curl http://localhost:3001/api/v1/brands
```

## Frontend pairing

Point the Next.js app at this API:

```env
# nextjs-fsd-portfolio-template/.env.local
API_INTERNAL_URL=http://localhost:3001/api/v1
```

See the frontend [Getting Started](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/docs/GETTING-STARTED.md).
