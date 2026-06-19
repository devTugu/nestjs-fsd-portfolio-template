# White Label

Customize branding without code changes.

## Deploy-time brand

| Env | Purpose |
|-----|---------|
| `SEED_BRAND_NAME` | Demo company name in seed data (default `Portfolio`) |
| `SEED_CONTACT_EMAIL` | Contact email in seed (default `hello@example.com`) |
| `APP_DISPLAY_NAME` | Swagger / internal display name |
| `MFA_ISSUER` | Authenticator app issuer label |
| `CONTACT_EMAIL_SUBJECT_PREFIX` | Email subject prefix for contact notifications |

## CMS brand (runtime)

All public-facing copy is editable via site settings and CMS entities:

| Surface | Source |
|---------|--------|
| Site name, logos, favicon | `site_settings.header` |
| Hero copy, CTAs | `site_settings.hero` |
| About brief, mission, vision | `site_settings.about` |
| Brand accent color | `site_settings.theme.brandColor` |
| Footer, social links | `site_settings.footer` |
| SEO metadata | `site_settings.seo` |
| Navigation labels | `navigation_nodes` (localized) |
| Per-brand content | `brands`, `menu_items`, `brand_events` |

The Next.js frontend resolves brand context: CMS `siteName` → `NEXT_PUBLIC_BRAND_NAME` → fallback `"Your Site"`.

## Demo seed

`npm run seed` loads multi-brand demo content from `multi-brand-seed.const.ts`:

- 4 brands: `nomad-kitchen`, `steppe-grill`, `skyline-events`, `heritage-hall`
- Menu items, events, history, leadership, team, news, navigation

Replace demo content in admin after fork, or customize seed constants before first run.

## i18n

CMS fields support `en` and `mn`. Add locales by extending `LocalizedText` schema and frontend i18n config.

## Related

- [CMS Reference](CMS-REFERENCE.md)
- [ADR 005](adr/005-white-label.md)
- Frontend [White Label](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/docs/WHITE-LABEL.md)
