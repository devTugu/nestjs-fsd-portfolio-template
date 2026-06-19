# Backend Nest — Portfolio CMS API (Clean Architecture)

[![CI](https://github.com/devTugu/nestjs-fsd-portfolio-template/actions/workflows/ci.yml/badge.svg)](https://github.com/devTugu/nestjs-fsd-portfolio-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Coverage](https://img.shields.io/badge/coverage-89%25-brightgreen)](https://github.com/devTugu/nestjs-fsd-portfolio-template/actions/workflows/ci.yml)

Production-ready **NestJS** REST API for **portfolio websites** — **Clean Architecture**, **JWT + OIDC + TOTP MFA**, **RBAC**, **Redis**, **MySQL**, and a full **Portfolio CMS** (Projects, Skills, Experiences, Site Settings, Contact, **Blog**, **Pricing**, **Navigation**).

Pairs with [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) for the public site + admin UI (BFF, httpOnly cookies, inline MFA on `/sign-in`).

**Regulated enterprise:** audit read API, retention scheduler, GDPR export/erasure, OTEL/Sentry opt-in, Railway + Helm deploy paths — see [REGULATED-ENTERPRISE-CHECKLIST.md v2.3](docs/REGULATED-ENTERPRISE-CHECKLIST.md).

---

## Why this template?

| Use case | What you get |
|----------|--------------|
| Freelancer / agency portfolio | Public API + admin CMS out of the box |
| Client project kickoff | Fork, seed demo content, customize in hours |
| Regulated / enterprise starter | SOC2 mapping, audit logs, retention, runbooks |
| Learning Clean Architecture | Real modules — not a toy CRUD demo |
| Full-stack starter | Same RBAC stack as [nestjs-fsd-template](https://github.com/devTugu/nestjs-fsd-template) + portfolio domain |

**Dual-route API design:** public read endpoints (`@Public()`) and admin CRUD (`/admin/*` + JWT + permissions) — draft content never leaks to the public site.

---

## Architecture

```
src/
├── domain/              # Entities, repository interfaces, domain services (no Nest/ORM)
├── application/         # Use cases, ports, application DTOs
├── infrastructure/      # TypeORM, Redis, JWT/bcrypt, OIDC/MFA, migrations, seed
├── presentation/http/   # Controllers (v1 public + admin), guards, filters, DTOs
└── shared/              # Constants, shared types, utilities
```

**Dependency rule:** `presentation` → `application` → `domain` ← `infrastructure`

| Guide | Description |
|-------|-------------|
| [Architecture overview](docs/ARCHITECTURE.md) | Layers, modules, request flow |
| [API reference](docs/API.md) | All v1 endpoints (public + admin) |
| [Regulated checklist v2.3](docs/REGULATED-ENTERPRISE-CHECKLIST.md) | 29 controls + verification gate |
| [Railway deploy](docs/RAILWAY.md) | Full-stack PaaS guide |
| [Production](docs/PRODUCTION.md) · [Security](docs/SECURITY.md) · [Runbook](docs/RUNBOOK.md) | Deploy, hardening, incidents |
| [ADR 001–013](docs/adr/) | Architecture decisions (Clean Arch → blog/pricing CMS) |
| [Contributing](docs/CONTRIBUTING.md) | Adding features |

---

## Gallery

| Swagger (`/docs`) | Health readiness | Unit test coverage |
|---|---|---|
| ![Swagger API docs](docs/gallery/swagger-docs.png) | ![Health ready probe](docs/gallery/health-ready.png) | ![Test coverage report](docs/gallery/test-coverage.png) |

CI enforces coverage thresholds: **application/** ≥80% lines (70% branches) · **domain/** ≥80%.

Current local gate: **~89%** statements, **192** unit tests.

---

## Tech stack

| Category | Technology |
|----------|------------|
| Framework | NestJS 11 |
| Architecture | Clean Architecture (layered) |
| Database | MySQL 8 + TypeORM migrations |
| Cache | Redis 7 (or in-memory when `REDIS_ENABLED=false`) |
| Auth | JWT + refresh rotation + Redis blacklist |
| Identity | Generic OIDC + TOTP MFA (Keycloak/Auth0 compatible) |
| CMS | Projects, Skills, Experiences, Site Settings, Contact, Blog, Pricing, Navigation |
| Media | URL fields (default); optional S3-compatible upload |
| Email | Optional SMTP notifications for contact form |
| Observability | Winston logs; OTEL + Sentry opt-in |
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

Required: `DB_*`, `JWT_*` (min 32 chars each), `MFA_ENCRYPTION_KEY` (min 32 chars for TOTP).

### 2. Database

```bash
npm run migration:run
npm run seed
```

Seed creates:

- RBAC roles: `SUPER_ADMIN`, `CONTENT_MANAGER`
- Admin user: `admin@example.com` / `Admin123!` (override via `SEED_ADMIN_*`)
- Demo portfolio + marketing content (projects, skills, experiences, blog, pricing, navigation, site settings)

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

Full setup: [docs/PRODUCTION.md](docs/PRODUCTION.md#local-development).

---

## API overview (v1)

### Public (no auth)

| Resource | Endpoints |
|----------|-----------|
| Projects | `GET /api/v1/projects`, `GET /api/v1/projects/:slug` |
| Skills | `GET /api/v1/skills` |
| Experiences | `GET /api/v1/experiences` |
| Site settings | `GET /api/v1/site-settings` |
| Blog | `GET /api/v1/blog-posts`, `GET /api/v1/blog-posts/:slug` |
| Pricing | `GET /api/v1/pricing` |
| Navigation | `GET /api/v1/navigation?scope=HEADER\|FOOTER` |
| Contact | `POST /api/v1/contact` (rate limited: 5/min) |

### Admin (JWT + permissions)

| Resource | Endpoints | Permission prefix |
|----------|-----------|-------------------|
| Projects | `CRUD /api/v1/admin/projects` | `PROJECT_*` |
| Skills | `CRUD /api/v1/admin/skills` | `SKILL_*` |
| Experiences | `CRUD /api/v1/admin/experiences` | `EXPERIENCE_*` |
| Site settings | `GET/PATCH /api/v1/admin/site-settings` | `SITE_SETTING_*` |
| Contact inbox | `GET/PATCH/DELETE /api/v1/admin/contact-messages` | `CONTACT_*` |
| Blog | `CRUD /api/v1/admin/blog-posts` | `BLOG_*` |
| Pricing | `CRUD /api/v1/admin/pricing/plans`, feature rows | `PRICING_*` |
| Navigation | `CRUD /api/v1/admin/navigation` + reorder | `NAV_*` |
| Audit logs | `GET /api/v1/admin/audit-logs` | `AUDIT_READ` |
| Media upload | `POST /api/v1/admin/media/upload` | `PROJECT_UPDATE` (optional S3) |

### System (RBAC)

| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /api/v1/auth/login`, `refresh`, `logout`, MFA, OAuth |
| Users | `CRUD /api/v1/users` + GDPR export/erasure |
| Roles | `CRUD /api/v1/roles`, assign / unassign |
| Permissions | `CRUD /api/v1/permissions` |
| Health | `GET /api/v1/health/live`, `GET /api/v1/health/ready` |

Complete reference: **[docs/API.md](docs/API.md)**

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
| Config | [`railway.toml`](railway.toml) + [`scripts/railway-start.sh`](scripts/railway-start.sh) |
| Variables | [`.env.railway.example`](.env.railway.example) |
| Guide | **[docs/RAILWAY.md](docs/RAILWAY.md)** |
| Images | Cloudinary / R2 / S3 URLs, or configure `S3_*` env vars |
| Database | MySQL plugin `${{MySQL.*}}` |
| Redis | `${{Redis.REDIS_URL}}` |
| First deploy | `RUN_SEED=true` once, then `false` |

---

## Production (Docker)

```bash
docker compose up -d --build
```

- Migrations run on container start (`scripts/railway-start.sh` / `docker-entrypoint.sh`)
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
| `npm run test:cov` | Coverage (CI gate) |
| `npm run test:e2e` | E2E (requires DB + Redis) |
| `npm run lint` | ESLint |

---

## Production readiness checklist

- [ ] `NODE_ENV=production`, `SWAGGER_ENABLED=false`
- [ ] `REDIS_ENABLED=true` with shared Redis for multi-instance deploys
- [ ] Strong JWT + MFA secrets (32+ chars), never committed to git
- [ ] Migrations applied before app start
- [ ] Health probes: `/api/v1/health/live`, `/api/v1/health/ready`
- [ ] CORS locked to frontend origin
- [ ] `AUDIT_PURGE_ENABLED=true` in production (optional retention cron)
- [ ] Portfolio images via external URLs or configured S3
- [ ] CI green: lint, test:cov, build, e2e

Details: [docs/REGULATED-ENTERPRISE-CHECKLIST.md](docs/REGULATED-ENTERPRISE-CHECKLIST.md)

---

## CI

GitHub Actions on push/PR to `main` and `develop`: lint → build → test:cov → migrate/seed → e2e → npm audit.

Optional: [`.github/workflows/railway-deploy.yml`](.github/workflows/railway-deploy.yml) when `RAILWAY_TOKEN` + `RAILWAY_SERVICE_ID` secrets are set.

---

## Verification (release gate)

```bash
npm ci && npm run lint && npm run build && npm run test:cov
npm run migration:run && npm run seed && npm run test:e2e
```

Full-stack (with frontend): see checklist in [docs/REGULATED-ENTERPRISE-CHECKLIST.md](docs/REGULATED-ENTERPRISE-CHECKLIST.md).

---

## Pairing with the frontend

| Backend | Frontend |
|---------|----------|
| [nestjs-fsd-portfolio-template](https://github.com/devTugu/nestjs-fsd-portfolio-template) | [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) |
| Port `3001` (local) | Port `3000` |
| Portfolio CMS + RBAC API | Public portfolio site + admin CMS (BFF) |

Base admin-only stack (no portfolio):

| [nestjs-fsd-template](https://github.com/devTugu/nestjs-fsd-template) | [nextjs-fsd-template](https://github.com/devTugu/nextjs-fsd-template) |

---

## Releases

| Version | Highlights |
|---------|------------|
| **[v2.3.0](https://github.com/devTugu/nestjs-fsd-portfolio-template/releases/tag/v2.3.0)** (current) | Blog + Pricing + Navigation CMS, localized content (ADR 012), CI coverage gate |
| [v2.2.0](https://github.com/devTugu/nestjs-fsd-portfolio-template/releases/tag/v2.2.0) | Regulated enterprise: Railway deploy, audit retention, GDPR tests, OIDC/MFA |
| [v1.0.0](https://github.com/devTugu/nestjs-fsd-portfolio-template/releases/tag/v1.0.0) | Initial Portfolio CMS API |

Pair with [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) **v2.3.0** for full-stack.

**v2.4 roadmap:** full GDPR cross-entity export, live Helm deploy.

---

## Documentation index

| Doc | Purpose | Keep? |
|-----|---------|-------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layer/module overview | Yes |
| [SYSTEM-ARCHITECTURE.md](docs/SYSTEM-ARCHITECTURE.md) | C4 diagrams + CTO system view | Yes |
| [WHITE-LABEL.md](docs/WHITE-LABEL.md) | Brand/env/CMS configuration | Yes |
| [pitch/ARCHITECTURE-PITCH.md](docs/pitch/ARCHITECTURE-PITCH.md) | Marp slide deck (PDF export) | Yes |
| [API.md](docs/API.md) | Endpoint reference | Yes |
| [PRODUCTION.md](docs/PRODUCTION.md) | Local + Docker + Railway | Yes |
| [RAILWAY.md](docs/RAILWAY.md) | Railway full-stack runbook | Yes |
| [SECURITY.md](docs/SECURITY.md) | Threat model, headers | Yes |
| [RUNBOOK.md](docs/RUNBOOK.md) | Incidents, rotation | Yes |
| [COMPLIANCE.md](docs/COMPLIANCE.md) | SOC2 mapping | Yes |
| [AUDIT-RETENTION.md](docs/AUDIT-RETENTION.md) | Retention policy + scheduler | Yes |
| [BACKUP-RESTORE.md](docs/BACKUP-RESTORE.md) | DB backup ops | Yes |
| [REGULATED-ENTERPRISE-CHECKLIST.md](docs/REGULATED-ENTERPRISE-CHECKLIST.md) | 29-item gate | Yes |
| [ENTERPRISE-PROMPT-PACK.md](docs/ENTERPRISE-PROMPT-PACK.md) | AI/client prompts | Yes |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Dev workflow | Yes |
| [contracts/api-envelope.md](docs/contracts/api-envelope.md) | Shared API shape | Yes |
| [adr/*.md](docs/adr/) | Architecture decisions | Yes |
| [articles/full-stack-portfolio-starter-devto.md](docs/articles/full-stack-portfolio-starter-devto.md) | dev.to draft | Optional |

---

## License

[MIT](LICENSE) — Copyright (c) 2026 Tuguldur Unurtsetseg (`devTugu`).

Fork and use freely. Attribution appreciated.
