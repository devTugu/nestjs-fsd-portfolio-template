# White-label configuration

Configure project name, logos, SEO, MFA issuer, and email branding **without code changes**.

Paired frontend guide: [nextjs-fsd-portfolio-template/docs/WHITE-LABEL.md](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/docs/WHITE-LABEL.md)

## Quick start (5 minutes)

1. Copy env templates:

```bash
cp .env.example .env
cp ../nextjs-fsd-portfolio-template/.env.example ../nextjs-fsd-portfolio-template/.env.local
```

2. Set brand env vars (both repos):

| Variable | Example | Purpose |
|----------|---------|---------|
| `APP_DISPLAY_NAME` | `Acme Platform` | Swagger title, contact email subject prefix |
| `MFA_ISSUER` | `Acme Admin` | Authenticator app label |
| `SEED_BRAND_NAME` | `Acme` | Default CMS site name on seed |
| `SEED_CONTACT_EMAIL` | `hello@acme.com` | Default contact email on seed |
| `NEXT_PUBLIC_APP_NAME` | `Acme Admin` | Dashboard + sign-in title (frontend) |
| `NEXT_PUBLIC_BRAND_NAME` | `Acme` | Public fallback when CMS empty (frontend) |
| `NEXT_PUBLIC_SITE_URL` | `https://acme.com` | Canonical URL / metadataBase (frontend) |

3. Run migrations + seed:

```bash
npm run migration:run && npm run seed
```

4. Upload logos in **Dashboard → Site settings → Header** (marketing logo, dark logo, admin logo, favicon).

## Three-tier model

| Tier | Mechanism | Examples |
|------|-----------|----------|
| **Deploy-time** | `.env`, Helm `brand.*` values | `APP_DISPLAY_NAME`, `MFA_ISSUER`, `NEXT_PUBLIC_APP_NAME` |
| **Runtime CMS** | Site settings API + admin UI | `siteName`, `logoUrl`, SEO, hero, footer |
| **i18n chrome** | `messages/*.json` with `{brandName}` | Marketing fallbacks, auth hero copy |

**Resolution order:** CMS value → env fallback → generic i18n default.

## Backend env reference

| Key | Default | Used by |
|-----|---------|---------|
| `APP_DISPLAY_NAME` | `Portfolio Platform` | Swagger (`/docs`) |
| `CONTACT_EMAIL_SUBJECT_PREFIX` | `[Portfolio Contact]` | Contact notification emails |
| `MFA_ISSUER` | `Portfolio Admin` | TOTP QR label |
| `SEED_BRAND_NAME` | `Portfolio` | `npm run seed` site settings |
| `SEED_CONTACT_EMAIL` | `hello@example.com` | Seed contact email |

## CMS branding fields

`GET/PATCH /api/v1/admin/site-settings` header section:

- `logoUrl` — marketing header (light)
- `logoDarkUrl` — marketing header (dark mode)
- `adminLogoUrl` — dashboard sidebar
- `faviconUrl` — public site favicon override
- `siteName` — localized public brand name (EN/MN)

## Helm

Override `brand` block in [`deploy/helm/portfolio-stack/values.yaml`](../deploy/helm/portfolio-stack/values.yaml):

```yaml
brand:
  appDisplayName: Acme Platform
  mfaIssuer: Acme Admin
  nextPublicAppName: Acme Admin
  nextPublicBrandName: Acme
  nextPublicSiteUrl: https://acme.example.com
```

## Logo assets

- Prefer SVG or PNG with transparent background
- Recommended header height: 32px (max width ~140px)
- Provide `logoDarkUrl` when light logo is invisible on dark backgrounds
- Admin sidebar logo: square or compact mark (~32×32)

## Checklist before go-live

- [ ] All brand env vars set in API + frontend services
- [ ] `SEED_BRAND_NAME` updated before first seed (or patch site settings in admin)
- [ ] Logos uploaded in site settings
- [ ] `NEXT_PUBLIC_SITE_URL` matches production domain
- [ ] MFA issuer shows correct company name in authenticator app
- [ ] Contact form email subject uses `CONTACT_EMAIL_SUBJECT_PREFIX`

See [ADR 014](./adr/014-white-label-brand-configuration.md) for design rationale.
