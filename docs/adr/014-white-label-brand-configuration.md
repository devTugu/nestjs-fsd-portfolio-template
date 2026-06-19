# ADR 014: White-label brand configuration

## Status

Accepted — 2026-06-19

## Context

The portfolio template ships with demo branding ("Portfolio", "Admin Console", Stripe-style marketing copy). Regulated enterprise adopters need to rebrand for their company without forking UI code or redeploying for every copy change.

## Decision

Adopt a **three-tier white-label model**:

1. **Deploy-time env** — identity that must be consistent across services (admin app name, MFA issuer, Swagger title, email subject prefix, seed defaults).
2. **Runtime CMS** — marketing-visible brand (logos, site name, SEO, hero) via existing site settings singleton.
3. **i18n placeholders** — translatable template copy using `{brandName}` interpolation for demo sections not worth CMS modules.

Extend site settings `header` JSON with `logoDarkUrl`, `adminLogoUrl`, and `faviconUrl`. Wire `logoUrl` to marketing header (previously stored but not rendered).

## Consequences

**Positive**

- Fork → configure → deploy in minutes
- Clear separation: ops env vs content manager CMS vs translator i18n
- Helm `brand` values block for K8s adopters

**Negative**

- Admin brand (`NEXT_PUBLIC_APP_NAME`) and public brand (`siteName`) can diverge if not coordinated
- Landing sections below hero remain i18n-driven (not full CMS)

## Alternatives considered

- **Full CMS for all marketing sections** — rejected; overlaps navigation/blog/pricing modules, high maintenance for a template base.
- **Single `BRAND_NAME` env only** — rejected; marketing teams need runtime logo/SEO edits without redeploy.
