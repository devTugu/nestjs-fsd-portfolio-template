# ADR 013: Blog & Pricing Public Site Modules

## Status

Accepted

## Context

The paired [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) public marketing site needs CMS-backed **Blog**, **Pricing**, and **Navigation** APIs. ADR 005 established the dual-route portfolio pattern; ADR 012 added localized `{ en, mn }` content. Frontend ADRs 009 (public marketing site) and 010 (Stripe-style pricing expansion) depend on these backend modules.

## Decision

### Blog

| Concern | Approach |
|---------|----------|
| Storage | `blog_posts` relational table |
| Public API | `GET /api/v1/blog-posts`, `GET /api/v1/blog-posts/:slug` — published only |
| Admin API | CRUD `/api/v1/admin/blog-posts` |
| Permissions | `BLOG_READ`, `BLOG_CREATE`, `BLOG_UPDATE`, `BLOG_DELETE` |
| Categories | `PRODUCT`, `ENGINEERING`, `CORPORATE`, `INDUSTRY` |
| Localization | `title`, `excerpt`, `content`, `authorName`, `authorRole` as LocalizedText |

### Pricing

| Concern | Approach |
|---------|----------|
| Storage | `pricing_plans` + `pricing_feature_rows` |
| Public API | `GET /api/v1/pricing` — published plans + ordered feature matrix |
| Admin API | CRUD `/api/v1/admin/pricing/plans` and `/api/v1/admin/pricing/feature-rows` |
| Permissions | `PRICING_READ`, `PRICING_CREATE`, `PRICING_UPDATE`, `PRICING_DELETE` |
| Localization | Plan names, descriptions, features, CTA labels; feature row product/values |

### Navigation

See [ADR 011](./011-navigation-tree-cms.md) — implemented in the same release train.

### Seed data

Demo blog post, pricing plans, feature rows, and navigation tree ship in seed constants for local dev and Railway first deploy (`RUN_SEED=true`).

## Consequences

### Positive

- Full-stack parity with frontend marketing pages
- Same RBAC, audit, and localized content patterns as portfolio modules
- Public endpoints filter `isPublished` — drafts never leak

### Negative

- Additional migration surface (006–008) and test coverage required
- Pricing feature matrix is relational — not a single JSON blob

## References

- [docs/API.md](../API.md)
- [ADR 012 — CMS localized content](./012-cms-localized-content.md)
- Frontend: `docs/adr/009-public-marketing-site.md`, `docs/adr/010-stripe-public-site-expansion.md`
