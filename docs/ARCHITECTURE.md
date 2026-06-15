# Architecture Overview

This document describes how the Portfolio CMS API is structured and how requests flow through the system.

## Layer diagram

```
┌─────────────────────────────────────────────────────────────┐
│  presentation/http                                          │
│  • public controllers  (@Public)                            │
│  • admin controllers   (@Permissions)                         │
│  • guards, filters, interceptors, DTOs                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  application                                                │
│  • use cases (one operation per class)                      │
│  • output DTOs + mappers                                    │
│  • ports (NotificationPort, MediaStoragePort)               │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  domain                                                     │
│  • entities (pure TypeScript classes)                       │
│  • repository interfaces                                    │
│  • domain services (e.g. experience date rules)             │
│  • value objects (Email)                                      │
└───────────────────────────▲─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│  infrastructure                                             │
│  • TypeORM entities, mappers, repositories                  │
│  • Redis / JWT / bcrypt adapters                            │
│  • Nodemailer, S3 adapters                                  │
│  • migrations, seed                                         │
└─────────────────────────────────────────────────────────────┘
```

**Rule:** dependencies point inward only. Domain has zero imports from outer layers.

## Bounded contexts

| Context | Domain path | Public API | Admin API |
|---------|-------------|------------|-----------|
| Auth | (uses User) | `/auth/*` | — |
| RBAC | `domain/authorization`, `domain/user` | — | `/users`, `/roles`, `/permissions` |
| Projects | `domain/project` | `/projects` | `/admin/projects` |
| Skills | `domain/skill` | `/skills` | `/admin/skills` |
| Experiences | `domain/experience` | `/experiences` | `/admin/experiences` |
| Site settings | `domain/site-setting` | `/site-settings` | `/admin/site-settings` |
| Contact | `domain/contact` | `POST /contact` | `/admin/contact-messages` |
| Media | port only | — | `/admin/media/upload` |

## Request flow (admin create project)

1. `ProjectAdminV1Controller` validates `CreateProjectDto`
2. `CreateProjectUseCase` checks slug uniqueness, sets `publishedAt` if published
3. `IProjectRepository.create()` persists via TypeORM
4. `toProjectOutput()` maps domain → API response
5. `ResponseInterceptor` wraps `{ success, data, timestamp, path, requestId }`
6. `AuditInterceptor` records POST on success

## Request flow (public list projects)

1. `ProjectPublicV1Controller` — `@Public()` skips JWT
2. `ListPublicProjectsUseCase` → repository filters `isPublished = true`
3. Unpublished / soft-deleted rows are never returned

## Module wiring

| Layer | Registration |
|-------|--------------|
| Repositories + adapters | `InfrastructureModule` (`@Global()`) |
| Use cases + controllers | `*PresentationModule` per context |
| Root | `AppModule` imports all presentation modules |

## Path aliases

| Alias | Path |
|-------|------|
| `@domain/*` | `src/domain/*` |
| `@application/*` | `src/application/*` |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@presentation/*` | `src/presentation/*` |
| `@shared/*` | `src/shared/*` |

## Related ADRs

- [001 — Clean Architecture](adr/001-clean-architecture.md)
- [005 — Portfolio CMS](adr/005-portfolio-cms.md)
