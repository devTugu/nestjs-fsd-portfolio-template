# ADR 009: OIDC SSO and TOTP MFA

## Status

Accepted

## Context

Regulated enterprise deployments require strong authentication beyond password-only login.

## Decision

- **OIDC SSO:** Generic adapter via `openid-client` (`OidcIdentityAdapter`). Enabled with `OAUTH_ENABLED=true`.
- **TOTP MFA:** `otplib` + AES-256-GCM encrypted secrets (`TotpMfaAdapter`). Enrollment via `/auth/mfa/enroll`.
- **Login step-up:** When `mfaEnabled`, login returns `{ requiresMfa, mfaToken }` instead of tokens.
- **SUPER_ADMIN:** MFA required when enrolled (enforce enrollment in production checklist).

## Consequences

- User entity gains `oauth_*` and `mfa_*` columns (migration `1730000000005`).
- `MFA_ENCRYPTION_KEY` required when MFA is used (32+ chars).
- BFF auth routes handle MFA/OAuth separately from `/api/backend` proxy.
