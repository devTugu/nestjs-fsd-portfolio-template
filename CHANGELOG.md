# Changelog

All notable changes to this project are documented in this file.

## [3.0.0] - 2026-06-19

### BREAKING CHANGE

Portfolio CMS modules removed: **projects**, **skills**, **experiences**, **pricing** (public and admin APIs).

Replaced by **multi-brand RE CMS**:

- Brands (with menu items and events)
- History timeline
- Leadership
- Team
- News (blog posts API paths unchanged: `/admin/blog-posts`)
- Navigation tree CMS
- Site settings, contact, media, dashboard, audit

### Added

- Migration `1730000000012-DropPortfolioTables` — drops legacy portfolio tables
- Helm chart `deploy/helm/re-cms-stack` (replaces `portfolio-stack`)
- Container images: `ghcr.io/<owner>/re-cms-api`
- `CONTRIBUTING.md`, root `SECURITY.md`
- Default branding: **RE CMS** / `re-cms-api` (OTEL, Swagger, MFA issuer)

### Changed

- Swagger description updated for multi-brand CMS
- Keycloak local dev OAuth client: `re-cms-admin` (realm id `portfolio` unchanged)
- White-label env defaults: `APP_DISPLAY_NAME`, `SEED_BRAND_NAME`, contact email prefix

### Removed

- Portfolio domain/application/infrastructure/presentation modules
- `deploy/helm/portfolio-stack` chart

### Migration

```bash
npm run migration:run
npm run seed
```

Pair with [nextjs-fsd-portfolio-template v3.0.0](https://github.com/devTugu/nextjs-fsd-portfolio-template/releases/tag/v3.0.0).

---

## [2.3.0] - 2026-06-19

Portfolio CMS baseline: projects, skills, experiences, pricing, blog, navigation, MFA, OAuth, GDPR, audit retention.

[Release notes](https://github.com/devTugu/nestjs-fsd-portfolio-template/releases/tag/v2.3.0)
