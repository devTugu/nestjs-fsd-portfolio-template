# Contributing

## Architecture

Follow Clean Architecture layers:

```
presentation → application → domain ← infrastructure
```

See [ADR 001](docs/adr/001-clean-architecture.md) and [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Adding a module

1. **Domain** — entity, repository interface in `src/domain/<context>/`
2. **Application** — use case + DTO in `src/application/<context>/use-cases/`
3. **Infrastructure** — TypeORM entity, mapper, repository in `src/infrastructure/`
4. **Presentation** — v1 controller, Swagger DTO, module registration
5. **Tests** — unit spec next to use case; e2e for critical HTTP paths
6. **Migration** — if schema changes: `npm run migration:generate --name=YourChange`

## Code style

- TypeScript strict; avoid `any`
- English for public API messages, Swagger, and docs
- Conventional commits for git history

## Running locally

```bash
npm ci
cp .env.example .env
npm run migration:run
npm run seed
npm run start:dev
```

## Tests

```bash
npm run lint
npm run build
npm test
npm run test:e2e
```

## Pull requests

- Keep PRs focused
- Ensure CI passes (lint, build, test:cov, e2e)
- Update [API.md](docs/API.md) and [CMS-REFERENCE.md](docs/CMS-REFERENCE.md) when adding endpoints
