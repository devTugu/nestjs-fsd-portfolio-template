# Compliance Mapping (SOC2-ready foundation)

| Control area | Implementation | Evidence |
|--------------|----------------|----------|
| Access control | JWT + RBAC + MFA (TOTP) + OIDC SSO | `PermissionsGuard`, ADR 009 |
| Audit logging | Write + read API | `audit_logs` table, `/admin/audit-logs` |
| Encryption in transit | TLS at ingress | Helm ingress TLS, HSTS on frontend |
| Encryption at rest | Operator-managed DB/storage | Railway/AWS RDS encryption |
| Change management | CI/CD + PR reviews | `.github/workflows/ci.yml`, `cd.yml` |
| Vulnerability mgmt | npm audit, Trivy, Dependabot | CI jobs, `.github/dependabot.yml` |
| Monitoring | OTEL traces + structured logs | `tracing.ts`, `instrumentation.ts` |
| Data retention | Audit retention policy | [AUDIT-RETENTION.md](AUDIT-RETENTION.md) |
| GDPR | Export + anonymize endpoints | `/admin/users/:id/export`, `/anonymize` |

This template provides **technical controls** — organizational policies (DPA, pen test schedule) remain operator responsibility.
