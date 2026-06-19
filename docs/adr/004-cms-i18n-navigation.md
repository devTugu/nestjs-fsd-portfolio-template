# ADR 004: CMS, i18n, and navigation

## Status

Accepted

## Context

Multi-brand sites need bilingual content (Mongolian + English) and admin-editable navigation without redeploys.

## Decision

1. **Localized content:** CMS text fields stored as JSON `{ en: string, mn: string }` (`LocalizedText`). Lists use `LocalizedStringList`. Validated at DTO layer.
2. **Navigation tree:** `navigation_nodes` table with `parentId`, `scope` (HEADER/FOOTER), localized labels, drag-reorder via `PUT /admin/navigation/reorder`.
3. **Public resolution:** Frontend picks locale from cookie via `pickLocalized()`. No locale prefix in API URLs.
4. **Seed:** Default navigation includes About mega menu (Us, History, Leadership, Team) + Brands, News, Contact.

## Consequences

**Positive:** Content editors manage nav and copy in admin; no code changes for menu updates.

**Negative:** Adding a third locale requires schema and frontend i18n extension.

## Related

- [CMS Reference](../CMS-REFERENCE.md)
- Frontend [ADR 004](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/docs/adr/004-cms-navigation-i18n.md)
