# ADR 012: CMS Localized Content

## Status

Accepted

## Context

Regulated Enterprise supports `en` and `mn` via next-intl (UI) and Navigation CMS (`{ en, mn }` JSON). Other CMS modules still store single-language strings, forcing per-entity localization work on every fork.

## Decision

### Platform types (both repos)

```typescript
type LocalizedText = { en: string; mn: string };
type LocalizedStringList = { en: string[]; mn: string[] };
```

- Backend: `src/shared/domain/localized-content.ts`
- Frontend: `src/shared/i18n/localized-content.ts`
- Coercion: `coerceLocalizedText()` / `coerceLocalizedStringList()` for migration from legacy strings
- Resolution: `pickLocalized(text, locale)` — requested locale → fallback `en`

### Storage

MySQL JSON columns for all human-readable CMS strings. Relational tables migrate `varchar/text` → `json`.

### API contract

Public and admin endpoints return **full** `{ en, mn }` objects. No `?locale=` stripping. Frontend resolves at render time.

### Slug policy

`slug` remains a **single locale-agnostic identifier** (generated from `title.en`). URL prefix migration remains deferred (ADR 010).

### Localized entities

| Module | Localized fields |
|--------|------------------|
| Site settings | hero text, siteName, footer copyright/tagline, seo title/description/keywords |
| Blog | title, excerpt, content, authorName, authorRole |
| Project | title, shortDescription, description, images[].alt |
| Pricing plan | name, description, priceLabel, priceNote, features, ctaLabel |
| Pricing feature row | productName, starter/pro/enterprise values |
| Skill | category |
| Experience | role, location, description |
| Navigation | labels, descriptions, metadata.ctaLabel (existing) |

### Not localized

User, Role, Permission, ContactMessage (inbound), AuditLog, URLs, emails, slugs, enum codes, tech/skill names (proper nouns).

### Admin UX

- **Strapi-style content locale:** `AdminContentLocaleProvider` + `AdminContentLocaleTabs` at form/sheet level (EN / MN pills). One visible input per field for the active locale — not stacked EN+MN fields.
- **Admin locale ≠ public locale:** Do not use `LocaleSwitcher` / `locale` cookie for CMS editing; admin locale is React state only.
- Reuse `LocalizedTextField`, `LocalizedTextareaField`, `LocalizedTagInputField` from `shared/ui/form-fields/` (they read `useAdminContentLocale()`).
- Wrap page-level forms (site settings, pricing inline cards) with `AdminContentLocaleProvider`. `AdminFormSheet` enables locale tabs by default; set `showContentLocale={false}` for User/Role/Permission sheets.

### Validation

- **`en` required**, **`mn` optional** (empty string allowed). Public `pickLocalized` falls back `mn` → `en`.
- Backend `LocalizedTextDto`: `@MinLength(1)` on `en` only; `mn` is `@IsString()` + `@MaxLength`.
- Frontend `localizedTextSchema` matches; use `localizedTextRequiredSchema` only when both locales must ship.

### Deprecated

`site_settings.header.navLinks` removed — use Navigation CMS (ADR 011).

## Consequences

- Breaking API shape for CMS string fields (template pair deploy together)
- Migration `1730000000008-LocalizeCmsContent` converts existing rows
- New CMS entities must follow ADR 012 checklist

## New CMS entity checklist

1. Human-readable string → `LocalizedText`
2. String array display text → `LocalizedStringList`
3. DTO → `LocalizedTextDto` reuse (`mn` optional)
4. Admin → `AdminContentLocaleProvider` + shared localized form fields
5. Public → `pickLocalized(field, locale)`
6. Seed → `localizedText(en, mn)` helper
7. Slug from `title.en` if applicable

## Related

- [ADR 010](./010-i18n-scaffold.md) — next-intl UI, cookie locale
- [ADR 011](./011-navigation-tree-cms.md) — navigation tree CMS
