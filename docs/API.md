# API Reference

Base URL: `/api/v1`

## Response envelope

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-06-19T12:00:00.000Z",
  "path": "/api/v1/brands",
  "requestId": "uuid"
}
```

Localized CMS fields return `{ "en": "...", "mn": "..." }`. The Next.js frontend resolves locale via cookie (`pickLocalized`).

---

## Public endpoints

No `Authorization` header required (`@Public()`).

### Site settings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/site-settings` | Hero, header, footer, SEO, contact, theme, about |

v3 fields: `theme.brandColor`, `about.{brief,mission,vision,values,stats}`, `hero.secondaryCtaLabel/Url`, `contactInfo.{address,workHours}`.

### Navigation

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| GET | `/navigation` | `scope=HEADER\|FOOTER` | Published navigation tree |

### Brands

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| GET | `/brands` | `type=RESTAURANT\|EVENT`, `limit` | Published brands |
| GET | `/brands/:slug` | — | Detail with `menuItems` (restaurant) or `events` (event) |

### History, leadership, team

| Method | Path | Description |
|--------|------|-------------|
| GET | `/history` | Published company timeline |
| GET | `/leadership` | Published leadership members |
| GET | `/team` | Published team members |

### News

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| GET | `/news` | `page`, `limit`, `category` | Published posts (paginated) |
| GET | `/news/:slug` | — | Single post; 404 if draft |

Legacy: `GET /blog-posts`, `GET /blog-posts/:slug` remain for backward compatibility.

### Contact

| Method | Path | Description |
|--------|------|-------------|
| POST | `/contact` | Submit form (rate-limited; honeypot field `website`) |

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health/live` | Liveness |
| GET | `/health/ready` | Readiness (DB + Redis) |

---

## Admin endpoints

Require `Authorization: Bearer <access_token>` and permission codes. See [CMS-REFERENCE.md](CMS-REFERENCE.md).

| Resource | Base path |
|----------|-----------|
| Brands | `/admin/brands` |
| Menu items | `/admin/menu-items` |
| Brand events | `/admin/brand-events` |
| History | `/admin/history` |
| Leadership | `/admin/leadership` |
| Team | `/admin/team` |
| Site settings | `/admin/site-settings` |
| Contact inbox | `/admin/contact-messages` |
| News | `/admin/blog-posts` |
| Navigation | `/admin/navigation` (nodes + reorder) |
| Dashboard | `/admin/dashboard/stats` |
| Audit logs | `/admin/audit-logs` |
| Media | `/admin/media/upload` |

Standard CRUD: `POST`, `GET`, `GET :id`, `PATCH :id`, `DELETE :id` unless noted.

---

## Auth endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Email/password login (may return MFA challenge) |
| POST | `/auth/mfa/verify` | Complete MFA login |
| POST | `/auth/mfa/enrollment/enroll` | Start MFA enrollment |
| POST | `/auth/mfa/enrollment/confirm` | Confirm MFA enrollment |
| POST | `/auth/mfa/enroll` | Enroll MFA (authenticated) |
| POST | `/auth/mfa/enroll/confirm` | Confirm MFA (authenticated) |
| POST | `/auth/mfa/disable` | Disable MFA |
| GET | `/auth/oauth/authorize` | OIDC authorization URL |
| POST | `/auth/oauth/callback` | OIDC callback |
| POST | `/auth/refresh` | Refresh token rotation |
| POST | `/auth/logout` | Invalidate refresh token |
| GET | `/auth/me` | Current user profile |

---

## RBAC endpoints

| Resource | Path |
|----------|------|
| Users | `/users` (+ `GET :id/export`, `POST :id/anonymize`) |
| Roles | `/roles` (+ `POST assign`, `DELETE assign/:userId/:roleId`) |
| Permissions | `/permissions` |

---

## Next.js BFF

Server components call this API via `API_INTERNAL_URL` with `revalidate: 60`. See `nextjs-fsd-portfolio-template/src/entities/public-api/public-server.ts`.
