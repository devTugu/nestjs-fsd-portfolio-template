# API Contract — Envelope, Errors, Permissions

Shared contract between **nestjs-fsd-portfolio-template** (API) and **nextjs-fsd-portfolio-template** (BFF admin). Keep both repos in sync when changing this document.

## Success envelope

```json
{
  "success": true,
  "data": { },
  "message": "optional human-readable message",
  "timestamp": "2026-06-16T12:00:00.000Z",
  "path": "/api/v1/users",
  "requestId": "uuid"
}
```

Frontend unwraps `data` in `src/shared/api/client.ts`.

## Error envelope

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found."
  },
  "timestamp": "2026-06-16T12:00:00.000Z",
  "path": "/api/v1/users/1",
  "requestId": "uuid"
}
```

Handled by `src/shared/api/errorHandler.ts`.

## Common error codes

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Invalid or expired token |
| `FORBIDDEN` | 403 | Missing permission |
| `NOT_FOUND` | 404 | Resource missing |
| `CONFLICT` | 409 | Duplicate or state conflict |
| `VALIDATION_ERROR` | 400 | DTO validation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Pagination

List endpoints return:

```json
{
  "items": [],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

Query params: `page`, `limit`, `search` (where supported).

## Permission codes sync checklist

When adding a permission:

1. Add to `nestjs-fsd-portfolio-template/src/infrastructure/database/seed/permissions.const.ts`
2. Run seed or migration for new codes
3. Add to `nextjs-fsd-portfolio-template/src/shared/config/permissions.ts`
4. Gate backend controller with `@Permissions('CODE')`
5. Gate frontend route/nav with `can('CODE')`
6. Update `docs/API.md` and BFF allowlist (`bff-allowlist.ts`)

### System permissions

`USER_*`, `ROLE_*`, `PERMISSION_*`, `DASHBOARD_READ`, `AUDIT_READ`

### Portfolio permissions

`PROJECT_*`, `SKILL_*`, `EXPERIENCE_*`, `SITE_SETTING_*`, `CONTACT_*`, `NAV_*`

## Auth headers

| Context | Header |
|---------|--------|
| Browser → BFF | Cookie: `accessToken`, `refreshToken` |
| BFF → Nest | `Authorization: Bearer <accessToken>` |
| All requests | `x-request-id: <uuid>` (optional correlation) |

## Versioning

All routes under `/api/v1/*`. Breaking changes require `/api/v2/*` (see ADR 002 API versioning).
