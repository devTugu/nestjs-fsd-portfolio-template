# Compliance Mapping (SOC2-ready foundation)

| Control area | Implementation | Evidence |
|--------------|----------------|----------|
| Access control (CC6.1) | JWT + RBAC + TOTP MFA + OIDC SSO + SUPER_ADMIN enrollment gate | `PermissionsGuard`, ADR 009, `e2e/mfa.spec.ts`, `e2e/permissions.spec.ts` |
| CSRF (CC6.1) | BFF CSRF on all mutating routes | `bff-csrf.ts`, `e2e/csrf.spec.ts` |
| Audit logging (CC7.2) | Write + read API + read meta-audit | `audit_logs`, `/admin/audit-logs`, `AUDIT_LOG_READ` action |
| Encryption in transit | TLS at ingress | Helm ingress TLS, HSTS on frontend |
| Encryption at rest | Operator-managed DB/storage | Railway/AWS RDS encryption |
| Change management | CI/CD + PR reviews | `.github/workflows/ci.yml`, `cd.yml` |
| Vulnerability mgmt | npm audit, Trivy, Dependabot | CI jobs, `.github/dependabot.yml` |
| Monitoring | OTEL traces + structured logs | `tracing.ts`, `instrumentation.ts` |
| Data retention | Audit retention policy | [AUDIT-RETENTION.md](AUDIT-RETENTION.md) |
| GDPR | Export + anonymize endpoints | `/admin/users/:id/export`, `/anonymize` |

**Organizational controls** (pen test schedule, DPA, incident response runbooks) remain operator responsibility.

## E2E evidence paths (frontend)

| Spec | SOC2 control |
|------|--------------|
| `e2e/csrf.spec.ts` | CSRF on cookie auth |
| `e2e/mfa.spec.ts` | MFA step-up |
| `e2e/permissions.spec.ts` | Least-privilege RBAC |
| `e2e/audit-logs.spec.ts` | Audit trail access |
| `e2e/bff-allowlist.spec.ts` | Attack surface reduction |
| `e2e/oauth.spec.ts` | OIDC SSO (Keycloak CI) |
