# ADR 011: Navigation Tree CMS

## Status

Accepted

## Context

Marketing header mega-menu and footer columns were hardcoded in `marketing-nav.ts` and partially duplicated in site settings `header.navLinks`. Regulated Enterprise CMS (ADR 005) requires:

- Per-resource RBAC and audit
- Publish/draft per entity
- Locale labels from CMS (not i18n keys)
- Separate storage (not site settings JSON blob)

## Decision

Introduce `navigation_nodes` adjacency-list table with:

| Concern | Approach |
|---------|----------|
| Storage | `navigation_nodes` table (`scope`, `parent_id`, `type`, `labels`, …) |
| Public API | `GET /api/v1/navigation?scope=HEADER\|FOOTER` — published tree only |
| Admin API | CRUD + batch reorder under `/api/v1/admin/navigation` |
| Permissions | `NAV_READ`, `NAV_CREATE`, `NAV_UPDATE`, `NAV_DELETE` |
| Audit | `navigation` resource segment in global audit interceptor |
| Labels | `{ en, mn }` CMS strings |
| Delete | Soft delete (`deleted_at`) |
| Publish | `isPublished` per node; public tree builder prunes unpublished/empty parents |

Node types:

- **HEADER:** `MEGA`, `COLUMN`, `LINK`, `SIDEBAR`, `PROMO`, `CTA_ROW`
- **FOOTER:** `GROUP`, `LINK`

Site settings retains branding only (`logoUrl`, `siteName`, footer `copyright`/`tagline`/`socialLinks`). `header.navLinks` deprecated.

Seed data maps former `marketing-nav.ts` structure with en/mn labels.

## Consequences

- Admin manages navigation at `/dashboard/navigation` with tree editor (dnd-kit reorder).
- Public site fetches navigation via BFF/internal API with 60s revalidate.
- Fail-closed fallback: Home, Pricing, Contact if API returns empty tree.
- `marketing-nav.ts` kept as seed reference only (no runtime imports).

## Alternatives considered

- Site settings JSON tree — rejected (no per-node audit/RBAC/query)
- i18n keys in API — rejected (ADR 005 blog/pricing pattern uses CMS strings)
