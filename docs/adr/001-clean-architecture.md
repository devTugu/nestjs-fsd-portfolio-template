# ADR 001: Clean Architecture

## Status

Accepted

## Context

The API serves as a sellable regulated-enterprise template. Architecture must be testable, framework-agnostic at the core, and teachable.

## Decision

Adopt four layers with strict dependency direction:

```
presentation → application → domain ← infrastructure
```

- **Domain:** pure entities, repository interfaces, domain services
- **Application:** use cases orchestrate domain logic via ports
- **Infrastructure:** TypeORM repositories, Redis, JWT, email, S3
- **Presentation:** NestJS controllers, guards, DTOs

Each bounded context (brand, history, auth, etc.) follows: domain entity → repository interface → use case → TypeORM repository → controller.

## Consequences

**Positive:** Unit tests mock repositories at use-case level; business rules stay in domain/application.

**Negative:** More files per feature than a simple CRUD module. Acceptable for template quality.

## Related

- [Architecture](../ARCHITECTURE.md)
