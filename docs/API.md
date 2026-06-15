# API Reference (v1)

Base URL: `/api/v1`

Global prefix is configured in `main.ts`. All successful responses are wrapped:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-06-15T12:00:00.000Z",
  "path": "/api/v1/projects",
  "requestId": "uuid"
}
```

Errors use a consistent shape from `AllExceptionsFilter`.

---

## Authentication

### Public endpoints

Decorated with `@Public()` — no `Authorization` header required.

### Protected endpoints

```
Authorization: Bearer <accessToken>
```

Admin portfolio routes also require the matching permission (see [Permissions](#permissions)).

### Auth endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | Public | Returns access + refresh tokens |
| POST | `/auth/refresh` | Public | Rotates tokens |
| POST | `/auth/logout` | Bearer | Revokes refresh token |
| GET | `/auth/me` | Bearer | Current user profile + permissions |

---

## Portfolio — Public

### Projects

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| GET | `/projects` | `featured`, `limit` (max 100) | Published projects, ordered by `sortOrder` |
| GET | `/projects/:slug` | — | Single published project; 404 if draft or missing |

### Skills

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| GET | `/skills` | `category` | Published skills |

### Experiences

| Method | Path | Description |
|--------|------|-------------|
| GET | `/experiences` | Published experiences, ordered |

### Site settings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/site-settings` | Singleton: hero, header, footer, seo, contactInfo |

Returns defaults when no row exists yet.

### Contact

| Method | Path | Rate limit | Description |
|--------|------|------------|-------------|
| POST | `/contact` | 5 / minute | Submit contact message |

**Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Project inquiry",
  "message": "I would like to discuss a project...",
  "website": ""
}
```

| Field | Rules |
|-------|-------|
| `name` | Required, max 120 chars |
| `email` | Valid email |
| `message` | Min 10 chars |
| `website` | Honeypot — must be empty or omitted |

---

## Portfolio — Admin

All routes require Bearer token + permission.

### Projects

| Method | Path | Permission |
|--------|------|------------|
| GET | `/admin/projects` | `PROJECT_READ` |
| POST | `/admin/projects` | `PROJECT_CREATE` |
| GET | `/admin/projects/:id` | `PROJECT_READ` |
| PATCH | `/admin/projects/:id` | `PROJECT_UPDATE` |
| DELETE | `/admin/projects/:id` | `PROJECT_DELETE` |

**Create body (required fields):** `title`, `shortDescription`, `description`, `techStack[]`

Optional: `slug`, `thumbnailUrl`, `images[]`, `liveUrl`, `repoUrl`, `isFeatured`, `isPublished`, `sortOrder`

Slug is auto-generated from title when omitted. Setting `isPublished: true` sets `publishedAt`.

### Skills

| Method | Path | Permission |
|--------|------|------------|
| GET | `/admin/skills` | `SKILL_READ` |
| POST | `/admin/skills` | `SKILL_CREATE` |
| GET | `/admin/skills/:id` | `SKILL_READ` |
| PATCH | `/admin/skills/:id` | `SKILL_UPDATE` |
| DELETE | `/admin/skills/:id` | `SKILL_DELETE` |

`proficiency`: integer 1–5.

### Experiences

| Method | Path | Permission |
|--------|------|------------|
| GET | `/admin/experiences` | `EXPERIENCE_READ` |
| POST | `/admin/experiences` | `EXPERIENCE_CREATE` |
| GET | `/admin/experiences/:id` | `EXPERIENCE_READ` |
| PATCH | `/admin/experiences/:id` | `EXPERIENCE_UPDATE` |
| DELETE | `/admin/experiences/:id` | `EXPERIENCE_DELETE` |

Domain rules: `isCurrent: true` requires no `endDate`; `endDate >= startDate`.

### Site settings

| Method | Path | Permission |
|--------|------|------------|
| GET | `/admin/site-settings` | `SITE_SETTING_READ` |
| PATCH | `/admin/site-settings` | `SITE_SETTING_UPDATE` |

Partial update — only sent JSON sections are merged.

### Contact messages

| Method | Path | Permission |
|--------|------|------------|
| GET | `/admin/contact-messages` | `CONTACT_READ` |
| PATCH | `/admin/contact-messages/:id` | `CONTACT_UPDATE` |
| DELETE | `/admin/contact-messages/:id` | `CONTACT_DELETE` |

**Status values:** `NEW`, `READ`, `ARCHIVED`

### Media upload (optional)

| Method | Path | Permission |
|--------|------|------------|
| POST | `/admin/media/upload` | `PROJECT_UPDATE` |

Multipart field: `file` (max 5 MB; jpeg, png, webp, gif)

Requires `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` configured. Otherwise use URL fields in CMS.

---

## RBAC — Admin

Inherited from the base template. See Swagger at `/docs` for full schemas.

| Resource | Base path |
|----------|-----------|
| Users | `/users` |
| Roles | `/roles` |
| Permissions | `/permissions` |

---

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health/live` | Public | Process alive |
| GET | `/health/ready` | Public | DB (+ Redis) connectivity |

---

## Permissions

Portfolio permission codes (seeded):

```
PROJECT_READ, PROJECT_CREATE, PROJECT_UPDATE, PROJECT_DELETE
SKILL_READ, SKILL_CREATE, SKILL_UPDATE, SKILL_DELETE
EXPERIENCE_READ, EXPERIENCE_CREATE, EXPERIENCE_UPDATE, EXPERIENCE_DELETE
SITE_SETTING_READ, SITE_SETTING_UPDATE
CONTACT_READ, CONTACT_UPDATE, CONTACT_DELETE
```

`SUPER_ADMIN` receives all permissions. `CONTENT_MANAGER` receives portfolio permissions only.

---

## Pagination (admin lists)

Query params: `page` (default 1), `limit` (default 20, max 100)

Response `data`:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 20,
  "totalPages": 0
}
```

Public list endpoints return a plain array (or single object) inside `data`.
