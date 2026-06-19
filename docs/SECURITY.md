# Security

Security controls for the regulated-enterprise RE template.

## Authentication

| Mechanism | Details |
|-----------|---------|
| JWT access token | Short-lived (`JWT_ACCESS_EXPIRES_IN`, default `15m`) |
| Refresh token | Rotated on use (`JWT_REFRESH_EXPIRES_IN`, default `7d`); Redis blacklist on logout |
| Login throttle | `LOGIN_THROTTLE_TTL` / `LOGIN_THROTTLE_LIMIT` (default 5/min) |
| Password hashing | bcrypt |

Required secrets: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (min 32 chars each).

## Multi-factor authentication (MFA)

TOTP-based MFA with optional enrollment during login.

| Env | Purpose |
|-----|---------|
| `MFA_ENCRYPTION_KEY` | Encrypt TOTP secrets (min 32 chars) |
| `MFA_ISSUER` | Display name in authenticator app |
| `MFA_REQUIRED_ROLES` | Comma-separated roles requiring MFA (default `SUPER_ADMIN`) |

Endpoints: `/auth/mfa/*`. Frontend handles inline MFA on `/sign-in` via BFF routes.

## OIDC (optional)

Set `OAUTH_ENABLED=true` and configure `OAUTH_ISSUER`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `OAUTH_CALLBACK_URL`.

Compatible with Keycloak, Auth0, and other OIDC providers.

## Authorization (RBAC)

Every admin route requires a permission code (e.g. `BRAND_UPDATE`). `PermissionsGuard` checks codes from the user's roles. Permission list cached in Redis when `REDIS_ENABLED=true` (`PERMISSION_CACHE_TTL_SEC`).

## Rate limiting

| Scope | Env vars | Default |
|-------|----------|---------|
| Global | `THROTTLE_TTL`, `THROTTLE_LIMIT` | 60 req/min |
| Contact form | `CONTACT_THROTTLE_*` | 5 req/min |

Storage: Redis when enabled, otherwise in-memory.

## CORS

`CORS_ORIGIN` — set to your Next.js frontend origin in production.

## Audit logging

Mutating admin actions are recorded in `audit_logs` via `AuditInterceptor`. Read via `GET /admin/audit-logs` (`AUDIT_READ`).

Retention: `AUDIT_PURGE_ENABLED`, `AUDIT_RETENTION_DAYS` (default 90). See [Operations](OPERATIONS.md).

## GDPR

| Endpoint | Permission | Action |
|----------|------------|--------|
| `GET /users/:id/export` | `USER_READ` | Export user data |
| `POST /users/:id/anonymize` | `USER_DELETE` | Anonymize PII |

## Input validation

- Global `ValidationPipe` (whitelist, forbidNonWhitelisted, transform)
- Contact honeypot field `website` (bots only)
- Localized content validated at DTO layer

## Transport and headers

- HTTPS required in production
- Request ID middleware for trace correlation
- Swagger disabled by default (`SWAGGER_ENABLED=false`)

## Related

- [Compliance](COMPLIANCE.md) — SOC2 mapping
- [ADR 003](adr/003-security-identity.md) — identity decisions
