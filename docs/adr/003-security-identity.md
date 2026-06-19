# ADR 003: Security and identity

## Status

Accepted

## Context

Regulated-enterprise customers require audit trails, optional SSO, and MFA for privileged roles.

## Decision

1. **Audit logging:** `AuditInterceptor` records mutating admin actions to `audit_logs`. Read API at `/admin/audit-logs`. Configurable retention purge.
2. **MFA:** TOTP with encrypted secrets (`MFA_ENCRYPTION_KEY`). Role-based requirement via `MFA_REQUIRED_ROLES`. Inline enrollment flow supported.
3. **OIDC:** Optional generic OIDC (`OAUTH_ENABLED`) for Keycloak/Auth0. Coexists with local email/password login.
4. **JWT:** Access + refresh token pair with rotation and Redis blacklist on logout.
5. **GDPR:** User export and anonymize endpoints on `/users/:id`.

## Consequences

**Positive:** 29-control compliance checklist satisfied without third-party auth lock-in.

**Negative:** Operators must manage `MFA_ENCRYPTION_KEY` lifecycle; rotation invalidates enrolled secrets.

## Related

- [Security](../SECURITY.md)
- [Compliance](../COMPLIANCE.md)
