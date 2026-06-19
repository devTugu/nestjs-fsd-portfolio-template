# ADR 005: Portfolio CMS Modules

## Status

Accepted

## Context

The base template provides RBAC admin APIs (users, roles, permissions). Portfolio websites need content management: projects, skills, work experience, site branding (hero/header/footer), and a contact form — with a **public read API** for the frontend and **admin CRUD** for content editors.

Requirements:

- Draft content must not appear on public endpoints
- Single admin user per client is common (`CONTENT_MANAGER` role)
- Images should work on ephemeral hosts (Railway) — URL-first, optional S3 upload
- Contact form needs spam protection and optional email notification

## Decision

### Dual-route pattern

| Audience | Path prefix | Auth |
|----------|-------------|------|
| Public site | `/api/v1/{resource}` | `@Public()` |
| Admin CMS | `/api/v1/admin/{resource}` | JWT + `@Permissions()` |

Public repositories filter `isPublished = true`. Admin repositories return all non-deleted rows.

### Modules

| Module | Storage | Soft delete |
|--------|---------|-------------|
| Projects | Relational + JSON (`images`, `techStack`) | Yes |
| Skills | Relational | Yes |
| Experiences | Relational + date fields | Yes |
| Site settings | Singleton row (id=1), JSON sections | No (upsert) |
| Contact messages | Relational, status enum | Hard delete |

### Site settings shape

One row with JSON columns: `hero`, `header`, `footer`, `seo`, `contact_info`. Defaults returned when row missing.

### Contact

- Public `POST /contact` with `@Throttle(5/min)` and honeypot field `website`
- `NotificationPort` — `NoopNotificationAdapter` default; `NodemailerNotificationAdapter` when `SMTP_HOST` set
- Admin inbox with status workflow: `NEW` → `READ` → `ARCHIVED`

### Media

- v1: URL string fields on entities (`thumbnailUrl`, etc.)
- Optional `MediaStoragePort` + S3 adapter for `POST /admin/media/upload`
- Railway / container deploys must not rely on local disk persistence

### RBAC extension

29 portfolio CMS permission codes (projects, skills, experiences, site settings, contact, blog, pricing, navigation) + `CONTENT_MANAGER` role with portfolio permissions only. Blog and pricing use **LocalizedText** per [ADR 012](./012-cms-localized-content.md). Navigation tree per [ADR 011](./011-navigation-tree-cms.md). Public marketing expansion per [ADR 013](./013-blog-pricing-public-site.md).

## Consequences

### Positive

- Clear separation between public and admin surfaces
- Reuses existing JWT, guards, audit, and response patterns
- Client can fork and ship without code changes for standard portfolios

### Negative

- More modules to maintain vs. a headless CMS SaaS
- S3 upload is optional — teams must configure storage or use external URLs

## References

- [docs/API.md](../API.md)
- [docs/ARCHITECTURE.md](../ARCHITECTURE.md)
- User module as implementation blueprint: `src/application/user/use-cases/`
