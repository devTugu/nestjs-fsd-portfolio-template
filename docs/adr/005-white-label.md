# ADR 005: White-label brand configuration

## Status

Accepted

## Context

Template buyers need to rebrand quickly for different clients without forking code per deployment.

## Decision

Three-tier brand model:

| Tier | Source | Examples |
|------|--------|----------|
| Deploy-time | Environment variables | `SEED_BRAND_NAME`, `APP_DISPLAY_NAME`, `MFA_ISSUER` |
| Runtime CMS | `site_settings` singleton | Logos, siteName, hero, about, `theme.brandColor`, SEO |
| UI chrome | Frontend i18n messages | `{brandName}` placeholder in `en.json` / `mn.json` |

Resolution order on frontend: CMS `siteName` → `NEXT_PUBLIC_BRAND_NAME` → `"Your Site"`.

`theme.brandColor` injects CSS variable `--marketing-indigo` on the marketing layout.

## Consequences

**Positive:** Single fork supports multiple client deployments via env + CMS.

**Negative:** Operators must understand which tier controls which surface.

## Related

- [White Label](../WHITE-LABEL.md)
- Frontend [ADR 005](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/docs/adr/005-white-label.md)
