# Multi-brand RE CMS API (NestJS + Clean Architecture)

[![CI](https://github.com/devTugu/nestjs-fsd-portfolio-template/actions/workflows/ci.yml/badge.svg)](https://github.com/devTugu/nestjs-fsd-portfolio-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Production-ready **NestJS** REST API for **multi-brand restaurant/event conglomerate** websites — **Clean Architecture**, **JWT + OIDC + TOTP MFA**, **RBAC**, **Redis**, **MySQL**, and full **CMS** (Brands, History, Leadership, Team, News, Navigation, Site Settings, Contact).

Pairs with [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) v3.0.0 for the marketing site + admin UI (BFF, httpOnly cookies).

---

## Why this template?

| Use case | What you get |
|----------|--------------|
| Restaurant / event group | Multi-brand CMS with menu items and events |
| Client project kickoff | Fork, seed demo content, customize in hours |
| Regulated / enterprise starter | SOC2 mapping, audit logs, GDPR, MFA |
| Learning Clean Architecture | Real modules — not a toy CRUD demo |

**Dual-route API:** public read endpoints (`@Public()`) and admin CRUD (`/admin/*` + JWT + permissions).

---

## Quick start

```bash
npm ci
cp .env.example .env
# Edit DB_* and JWT_* secrets
npm run migration:run
npm run seed
npm run start:dev
```

| Resource | URL |
|----------|-----|
| API base | `http://localhost:3001/api/v1` |
| Public brands | `GET /api/v1/brands` |
| Admin | `POST /api/v1/admin/brands` (Bearer token) |

**Seed admin:** `admin@example.com` / `Admin123!`

Full setup: [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md)

---

## API overview (v3)

### Public

| Resource | Endpoints |
|----------|-----------|
| Brands | `GET /brands`, `GET /brands/:slug` |
| History | `GET /history` |
| Leadership | `GET /leadership` |
| Team | `GET /team` |
| News | `GET /news`, `GET /news/:slug` |
| Site settings | `GET /site-settings` |
| Navigation | `GET /navigation?scope=HEADER\|FOOTER` |
| Contact | `POST /contact` |

### Admin

Brands, menu items, brand events, history, leadership, team, news, site settings, navigation, contact inbox, audit logs, media upload.

Complete reference: [docs/API.md](docs/API.md)

---

## Tech stack

| Category | Technology |
|----------|------------|
| Framework | NestJS 11 |
| Architecture | Clean Architecture |
| Database | MySQL 8 + TypeORM migrations |
| Cache | Redis 7 (optional) |
| Auth | JWT + OIDC + TOTP MFA |
| CMS | Brands, History, Leadership, Team, News, Navigation |

---

## Documentation

Start at **[docs/README.md](docs/README.md)**

| Guide | Description |
|-------|-------------|
| [Getting Started](docs/GETTING-STARTED.md) | Local setup |
| [Architecture](docs/ARCHITECTURE.md) | Layers and modules |
| [API](docs/API.md) | Endpoint reference |
| [CMS Reference](docs/CMS-REFERENCE.md) | Entities and permissions |
| [Security](docs/SECURITY.md) | Auth, MFA, audit |
| [Deployment](docs/DEPLOYMENT.md) | Docker, Railway |
| [Compliance](docs/COMPLIANCE.md) | SOC2 checklist |
| [Fork Guide](docs/FORK-GUIDE.md) | Backend fork |
| [ADR](docs/adr/) | Architecture decisions |

---

## Pairing

| Backend | Frontend |
|---------|----------|
| [nestjs-fsd-portfolio-template](https://github.com/devTugu/nestjs-fsd-portfolio-template) | [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) |
| Port `3001` | Port `3000` |
| **v3.0.0** | **v3.0.0** |

---

## Releases

| Version | Highlights |
|---------|------------|
| **[v3.0.0](CHANGELOG.md)** (current) | Multi-brand pivot: brands, history, leadership, team, news |
| v2.3.0 | Portfolio CMS (projects, skills, experiences, pricing) — removed in v3 |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Development watch |
| `npm run build` | Compile |
| `npm run migration:run` | Apply migrations |
| `npm run seed` | Seed RBAC + demo multi-brand content |
| `npm test` | Unit tests |
| `npm run test:e2e` | E2E tests |

---

## License

[MIT](LICENSE) — Copyright (c) 2026 Tuguldur Unurtsetseg (`devTugu`).
