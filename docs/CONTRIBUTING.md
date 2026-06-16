# Contributing

## Architecture

Follow Clean Architecture layers:

```
presentation → application → domain ← infrastructure
```

See [Architecture overview](ARCHITECTURE.md) and [ADR 001](adr/001-clean-architecture.md).

## Adding a portfolio module

Use the **User** or **Project** module as the blueprint:

1. **Domain** — entity + repository interface in `src/domain/<context>/`
2. **Application** — use cases + output mapper in `src/application/<context>/`
3. **Infrastructure** — TypeORM entity, mapper, repository; register in `InfrastructureModule`
4. **Presentation** — public + admin controllers, Swagger DTOs, presentation module
5. **RBAC** — add permission codes to `permissions.const.ts`, run seed
6. **Migration** — `npm run migration:generate --name=AddYourFeature`
7. **Tests** — unit spec next to each use case; e2e for public + admin paths
8. **Docs** — update [API.md](API.md) and README API table

### Public vs admin controllers

- Public: `@Public()` on class or handler — no JWT
- Admin: path prefix `admin/<resource>`, `@Permissions('RESOURCE_ACTION')`

Never expose draft/unpublished content on public endpoints.

## Adding a non-portfolio feature

Same layer flow as above. Register presentation module in `app.module.ts`.

## Code style

- TypeScript strict; avoid `any`
- English for public API messages, Swagger, and docs
- [Conventional commits](https://www.conventionalcommits.org/) for git history

## Running locally

```bash
npm install
cp .env.example .env
# For XAMPP without Redis: REDIS_ENABLED=false
npm run migration:run
npm run seed
npm run start:dev
```

Default admin after seed: `admin@example.com` / `Admin123!`

Demo portfolio content is seeded automatically (projects, skills, experiences, site settings).

## Tests

```bash
npm test
npm run test:cov    # ≥80% on application/ and domain/
npm run test:e2e    # requires MySQL + Redis (or REDIS_ENABLED=false in test env)
```

## Release checklist

```bash
npm ci && npm run lint && npm run migration:run && npm test -- --coverage && npm run test:e2e && npm run build
```
