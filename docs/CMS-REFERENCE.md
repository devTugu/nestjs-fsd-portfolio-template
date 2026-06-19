# CMS Reference

Content model for the v3 multi-brand RE template. All user-facing text fields use `LocalizedText` (`{ en: string, mn: string }`) unless noted.

## Site settings (`site_settings`)

Singleton row (`id = 1`).

| Block | Key fields |
|-------|------------|
| `hero` | `title`, `subtitle`, `description`, `ctaLabel`, `ctaUrl`, `secondaryCtaLabel`, `secondaryCtaUrl`, `imageUrl` |
| `header` | `logoUrl`, `logoDarkUrl`, `adminLogoUrl`, `faviconUrl`, `siteName` |
| `footer` | `copyright`, `tagline`, `socialLinks[]` |
| `seo` | `title`, `description`, `ogImageUrl`, `keywords[]` |
| `contactInfo` | `email`, `phone`, `location`, `address`, `workHours`, `showForm` |
| `theme` | `brandColor` (hex, drives `--marketing-indigo` on frontend) |
| `about` | `brief`, `mission`, `vision`, `values[]`, `stats[]` |

Permissions: `SITE_SETTING_READ`, `SITE_SETTING_UPDATE`

## Brands (`brands`)

| Field | Type | Notes |
|-------|------|-------|
| `slug` | string | Unique URL segment |
| `type` | `RESTAURANT` \| `EVENT` | Filters public list |
| `name`, `description` | LocalizedText | |
| `logoUrl`, `coverImageUrl` | string \| null | |
| `address`, `workHours` | LocalizedText \| null | |
| `phone`, `mapEmbed` | string \| null | |
| `socialLinks` | `{ platform, url }[]` | |
| `sortOrder` | number | |
| `isPublished`, `publishedAt` | boolean, date | Draft content hidden from public API |

Permissions: `BRAND_READ`, `BRAND_CREATE`, `BRAND_UPDATE`, `BRAND_DELETE`

## Menu items (`menu_items`)

Restaurant brands only. Linked via `brandId`.

| Field | Type |
|-------|------|
| `category`, `name`, `description` | LocalizedText |
| `price` | decimal |
| `imageUrl` | string \| null |
| `isAvailable`, `isPublished` | boolean |
| `sortOrder` | number |

Managed via `/admin/menu-items` (same `BRAND_*` permissions).

## Brand events (`brand_events`)

Event brands only. Linked via `brandId`.

| Field | Type |
|-------|------|
| `title`, `description`, `location` | LocalizedText |
| `eventDate` | datetime |
| `imageUrl` | string \| null |
| `isPublished`, `sortOrder` | |

Managed via `/admin/brand-events`.

## History (`history_entries`)

| Field | Type |
|-------|------|
| `year` | int |
| `title`, `description` | LocalizedText |
| `imageUrl` | string \| null |
| `sortOrder`, `isPublished` | |

Permissions: `HISTORY_*`

## Leadership (`leadership_members`)

| Field | Type |
|-------|------|
| `name` | string (not localized) |
| `title`, `quote` | LocalizedText |
| `imageUrl`, `socialLinks` | |
| `sortOrder`, `isPublished` | |

Permissions: `LEADERSHIP_*`

## Team (`team_members`)

| Field | Type |
|-------|------|
| `name` | string |
| `role` | LocalizedText |
| `imageUrl`, `socialLinks` | |
| `sortOrder`, `isPublished` | |

Permissions: `TEAM_*`

## News (`blog_posts`)

Table name unchanged; public API exposed as `/news`.

| Field | Type |
|-------|------|
| `slug` | string |
| `title`, `excerpt`, `content` | LocalizedText |
| `category` | string |
| `coverImageUrl` | string \| null |
| `isPublished`, `publishedAt` | |

Permissions: `BLOG_*`

## Navigation (`navigation_nodes`)

Tree structure with `parentId`, `scope` (`HEADER` \| `FOOTER`), `label` (LocalizedText), `href`, `sortOrder`, `isPublished`.

Permissions: `NAV_*`

## Contact (`contact_messages`)

Public `POST /contact` creates inbox rows. Admin: read, patch status, delete.

Permissions: `CONTACT_*`

## RBAC roles (seed)

| Role | Permissions |
|------|-------------|
| `SUPER_ADMIN` | All codes |
| `CONTENT_MANAGER` | `CMS_PERMISSION_CODES` (all CMS resources) |
| `E2E_VIEWER` | `USER_READ`, `BRAND_READ` |

Full permission list: `src/infrastructure/database/seed/permissions.const.ts`

## Removed in v3

`projects`, `skills`, `experiences`, `pricing_plans`, `pricing_feature_rows` — tables dropped by migration `1730000000012`. Legacy controller files may remain on disk but are not registered in `AppModule`.
