# ADR 002: Multi-brand pivot (v3.0.0)

## Status

Accepted — 2026-06-19

## Context

The template originally targeted individual developer portfolios (projects, skills, experiences, pricing). Product requirements shifted to a **multi-brand RE template** for restaurant/event conglomerates.

## Decision

1. **Pivot CMS entities:**
   - `brands` (`RESTAURANT` | `EVENT`), `menu_items`, `brand_events`
   - `history_entries`, `leadership_members`, `team_members`
   - Blog API aliased as `/news` (table `blog_posts` unchanged)
2. **Remove** portfolio entities: projects, skills, experiences, pricing (migration `1730000000012` drops tables).
3. **Extend** site settings: `theme.brandColor`, `about` block, hero secondary CTA, `contactInfo.workHours`/`address`.
4. **Navigation seed:** About mega menu + Brands/News/Contact.
5. **Permissions:** `BRAND_*`, `HISTORY_*`, `LEADERSHIP_*`, `TEAM_*` replace portfolio permissions.
6. **RE stack unchanged** — audit, MFA, OIDC, i18n, BFF pairing.

## Public API surface (v3)

```
GET /site-settings, /navigation, /brands, /brands/:slug
GET /history, /leadership, /team
GET /news, /news/:slug
POST /contact
```

## Consequences

**Positive:** Fork-ready for restaurant/event groups; admin manages all public content.

**Negative:** Breaking v3.0.0 release; v2 portfolio data not migrated.

**Supersedes:** Portfolio CMS ADRs (005, 013).

## Related

- Frontend [ADR 003](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/docs/adr/003-multi-brand-v3.md)
- [CMS Reference](../CMS-REFERENCE.md)
