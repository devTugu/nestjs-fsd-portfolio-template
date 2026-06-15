# Backend Nest — Portfolio CMS API (Clean Architecture)

[![CI](https://github.com/devTugu/nestjs-fsd-portfolio-template/actions/workflows/ci.yml/badge.svg)](https://github.com/devTugu/nestjs-fsd-portfolio-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/devTugu/nestjs-fsd-portfolio-template)](LICENSE)
[![Coverage](https://img.shields.io/badge/coverage-80%25+-brightgreen)](https://github.com/devTugu/nestjs-fsd-portfolio-template/actions/workflows/ci.yml)

Production-ready **NestJS** REST API for **portfolio websites** — **Clean Architecture**, **JWT authentication**, **RBAC**, **Redis**, **MySQL**, and a full **Portfolio CMS** (Projects, Skills, Experiences, Site Settings, Contact).

Pairs with [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) for the public site + admin UI.

---

## Why this template?

| Use case | What you get |
|----------|--------------|
| Freelancer / agency portfolio | Public API + admin CMS out of the box |
| Client project kickoff | Fork, seed demo content, customize in hours |
| Learning Clean Architecture | Real modules — not a toy CRUD demo |
| Full-stack starter | Same RBAC stack as [nestjs-fsd-template](https://github.com/devTugu/nestjs-fsd-template) + portfolio domain |

**Dual-route API design:** public read endpoints (`@Public()`) and admin CRUD (`/admin/*` + JWT + permissions) — draft content never leaks to the public site.

---

## Architecture

```
src/
├── domain/              # Entities, repository interfaces, domain services (no Nest/ORM)
├── application/         # Use cases, ports, application DTOs
├── infrastructure/      # TypeORM, Redis, JWT/bcrypt, email/S3 adapters, migrations, seed
├── presentation/http/   # Controllers (v1 public + admin), guards, filters, DTOs
└── shared/              # Constants, shared types, utilities
```

**Dependency rule:** `presentation` → `application` → `domain` ← `infrastructure`

| Guide | Description |
|-------|-------------|
| [Architecture overview](docs/ARCHITECTURE.md) | Layers, modules, request flow |
| [API reference](docs/API.md) | All v1 endpoints (public + admin) |
| [ADR 001 — Clean Architecture](docs/adr/001-clean-architecture.md) | Layer boundaries |
| [ADR 002 — API versioning](docs/adr/002-api-versioning.md) | URI versioning `/api/v1/*` |
| [ADR 003 — Audit logging](docs/adr/003-audit-logging.md) | Global audit interceptor |
| [ADR 004 — Redis and cache](docs/adr/004-redis-and-cache.md) | Token blacklist + permission cache |
| [ADR 005 — Portfolio CMS](docs/adr/005-portfolio-cms.md) | Content modules, public vs admin routes |
| [Production](docs/PRODUCTION.md) · [Security](docs/SECURITY.md) · [Contributing](docs/CONTRIBUTING.md) | Deploy, hardening, adding features |

---

## Gallery

| Swagger (`/docs`) | Health readiness | Unit test coverage |
|---|---|---|
| ![Swagger API docs](docs/gallery/swagger-docs.png) | ![Health ready probe](docs/gallery/health-ready.png) | ![Test coverage report](docs/gallery/test-coverage.png) |

CI enforces **≥80%** coverage thresholds on `application/` and `domain/` layers.

---

## Tech stack

| Category | Technology |
|----------|------------|
| Framework | NestJS 11 |
| Architecture | Clean Architecture (layered) |
| Database | MySQL 8 + TypeORM migrations |
| Cache | Redis 7 (or in-memory when `REDIS_ENABLED=false`) |
| Auth | JWT + refresh rotation + Redis blacklist |
| CMS | Projects, Skills, Experiences, Site Settings, Contact |
| Media | URL fields (default); optional S3-compatible upload |
| Email | Optional SMTP notifications for contact form |
| API | URI versioning `/api/v1/*` |
| Docs | Swagger at `/docs` (optional) |

---

## Quick start

### Prerequisites

- Node.js 18+
- MySQL 8 (XAMPP, Docker, or Railway)
- Redis 7 (optional — set `REDIS_ENABLED=false` for in-memory cache)

### 1. Install

```bash
npm install
cp .env.example .env
```

Required: `DB_*`, `JWT_*` (min 32 chars each).

### 2. Database

```bash
npm run migration:run
npm run seed
```

Seed creates:

- RBAC roles: `SUPER_ADMIN`, `CONTENT_MANAGER`
- Admin user: `admin@example.com` / `Admin123!` (override via `SEED_ADMIN_*`)
- Demo portfolio content (3 projects, 8 skills, 2 experiences, site settings)

### 3. Run

```bash
npm run start:dev
```

| Resource | URL |
|----------|-----|
| API base | `http://localhost:3001/api/v1` |
| Swagger | `http://localhost:3001/docs` (if `SWAGGER_ENABLED=true`) |
| Public projects | `GET /api/v1/projects` |
| Admin CMS | `POST /api/v1/admin/projects` (Bearer token) |

Local Redis (optional):

```bash
docker compose -f docker-compose.dev.yml up -d
```

Full setup details: [docs/PRODUCTION.md](docs/PRODUCTION.md#local-development).

---

## API overview (v1)

### Public (no auth)

| Resource | Endpoints |
|----------|-----------|
| Projects | `GET /api/v1/projects`, `GET /api/v1/projects/:slug` |
| Skills | `GET /api/v1/skills` |
| Experiences | `GET /api/v1/experiences` |
| Site settings | `GET /api/v1/site-settings` |
| Contact | `POST /api/v1/contact` (rate limited: 5/min) |

### Admin (JWT + permissions)

| Resource | Endpoints | Permission prefix |
|----------|-----------|-------------------|
| Projects | `CRUD /api/v1/admin/projects` | `PROJECT_*` |
| Skills | `CRUD /api/v1/admin/skills` | `SKILL_*` |
| Experiences | `CRUD /api/v1/admin/experiences` | `EXPERIENCE_*` |
| Site settings | `GET/PATCH /api/v1/admin/site-settings` | `SITE_SETTING_*` |
| Contact inbox | `GET/PATCH/DELETE /api/v1/admin/contact-messages` | `CONTACT_*` |
| Media upload | `POST /api/v1/admin/media/upload` | `PROJECT_UPDATE` (optional S3) |

### System (RBAC — inherited from base template)

| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /api/v1/auth/login`, `refresh`, `logout`, `GET me` |
| Users | `CRUD /api/v1/users` |
| Roles | `CRUD /api/v1/roles`, assign / unassign |
| Permissions | `CRUD /api/v1/permissions` |
| Health | `GET /api/v1/health/live`, `GET /api/v1/health/ready` |

Auth header: `Authorization: Bearer <accessToken>`

Complete reference with request/response notes: **[docs/API.md](docs/API.md)**

### Roles (seeded)

| Role | Scope |
|------|-------|
| `SUPER_ADMIN` | All permissions (users, roles, portfolio) |
| `CONTENT_MANAGER` | Portfolio CMS only — ideal for a single client admin |

---

## Railway deployment

Railway containers use **ephemeral filesystem** — do not rely on local file uploads.

| Concern | Recommendation |
|---------|------------------|
| Images | Paste **Cloudinary / R2 / S3 URLs** in CMS fields, or configure `S3_*` env vars |
| Database | Link MySQL via `${{MySQL.*}}` reference variables |
| Redis | Link Redis plugin; set `REDIS_URL=${{Redis.REDIS_URL}}` |
| Contact alerts | Set `SMTP_HOST` + `CONTACT_NOTIFY_EMAIL` (optional) |
| First deploy | Run migrations + seed after deploy |

See [docs/PRODUCTION.md — Railway](docs/PRODUCTION.md#railway).

---

## Production (Docker)

```bash
docker compose up -d --build
```

- Migrations run on container start (`scripts/docker-entrypoint.sh`)
- Requires MySQL + Redis in compose
- Set `SWAGGER_ENABLED=false` in production

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Development watch |
| `npm run build` | Compile |
| `npm run start:prod` | Run `dist/main.js` |
| `npm run migration:run` | Apply migrations |
| `npm run migration:generate --name=Name` | Generate migration |
| `npm run seed` | Seed RBAC + demo portfolio content |
| `npm test` | Unit tests |
| `npm run test:e2e` | E2E (requires DB + Redis) |
| `npm run test:cov` | Coverage report |
| `npm run lint` | ESLint |

---

## Production readiness checklist

- [ ] `NODE_ENV=production`, `SWAGGER_ENABLED=false`
- [ ] `REDIS_ENABLED=true` with shared Redis for multi-instance deploys
- [ ] Strong JWT secrets (32+ chars), never committed to git
- [ ] Migrations applied before app start
- [ ] Health probes: `/api/v1/health/live`, `/api/v1/health/ready`
- [ ] CORS locked to frontend origin
- [ ] Portfolio images via external URLs or configured S3
- [ ] CI green: lint, test (coverage), build

Details: [docs/PRODUCTION.md](docs/PRODUCTION.md) and [docs/SECURITY.md](docs/SECURITY.md).

---

## CI

GitHub Actions on push/PR to `main` and `develop`: lint → build → unit tests.

---

## Verification (release gate)

```bash
npm ci && npm run lint && npm run migration:run && npm test -- --coverage && npm run test:e2e && npm run build
```

---

## Pairing with the frontend

| Backend | Frontend |
|---------|----------|
| [nestjs-fsd-portfolio-template](https://github.com/devTugu/nestjs-fsd-portfolio-template) | [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) |
| Port `3001` (local) | Port `3000` |
| Portfolio CMS + RBAC API | Public portfolio site + admin CMS |

Base admin-only stack (no portfolio):

| [nestjs-fsd-template](https://github.com/devTugu/nestjs-fsd-template) | [nextjs-fsd-template](https://github.com/devTugu/nextjs-fsd-template) |

---

## Releases

Latest: **[v1.0.0](https://github.com/devTugu/nestjs-fsd-portfolio-template/releases/tag/v1.0.0)** — Portfolio CMS API (Projects, Skills, Experiences, Site Settings, Contact) on Clean Architecture + RBAC.

Pair with [nextjs-fsd-portfolio-template v1.0.0](https://github.com/devTugu/nextjs-fsd-portfolio-template/releases/tag/v1.0.0) (frontend).

---

## Article (dev.to)

Draft: [docs/articles/full-stack-portfolio-starter-devto.md](docs/articles/full-stack-portfolio-starter-devto.md)

---

## Adding a feature

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) — includes a checklist for new portfolio modules.

---

## License

[MIT](LICENSE)
