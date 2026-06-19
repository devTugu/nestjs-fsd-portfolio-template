# Compliance

SOC2-oriented control mapping and regulated-enterprise verification checklist for v3.

## Control summary

| # | Control area | Implementation |
|---|--------------|----------------|
| 1 | Access control | RBAC with permission codes per route |
| 2 | Authentication | JWT + refresh rotation + optional MFA |
| 3 | Session management | httpOnly cookies via Next.js BFF (frontend) |
| 4 | Password policy | Min 8 chars; bcrypt hashing |
| 5 | MFA | TOTP; role-based requirement (`MFA_REQUIRED_ROLES`) |
| 6 | OIDC federation | Optional `OAUTH_ENABLED` |
| 7 | Audit trail | `audit_logs` + `AuditInterceptor` |
| 8 | Audit retention | Configurable purge (`AUDIT_RETENTION_DAYS`) |
| 9 | GDPR export | `GET /users/:id/export` |
| 10 | GDPR erasure | `POST /users/:id/anonymize` |
| 11 | Rate limiting | Global + login + contact throttles |
| 12 | Input validation | class-validator DTOs, honeypot |
| 13 | CORS | Origin allowlist |
| 14 | Secrets management | Env vars; never committed |
| 15 | TLS | HTTPS in production |
| 16 | Health probes | `/health/live`, `/health/ready` |
| 17 | Structured logging | Winston JSON logs |
| 18 | Error tracking | Sentry opt-in |
| 19 | Distributed tracing | OpenTelemetry opt-in |
| 20 | Database encryption | `DB_SSL` for managed MySQL |
| 21 | Soft delete | CMS entities use `deleted_at` |
| 22 | Draft/publish | `isPublished` gates public API |
| 23 | Request tracing | `requestId` on every response |
| 24 | Permission cache TTL | Redis-backed with TTL |
| 25 | Refresh token blacklist | Redis on logout |
| 26 | Contact PII handling | Admin inbox; delete capability |
| 27 | Media upload auth | JWT + permissions on `/admin/media/upload` |
| 28 | Swagger disabled | Default `SWAGGER_ENABLED=false` |
| 29 | CI verification gate | Unit tests + coverage thresholds |

## Verification gate

Before production release:

```bash
npm run test          # Unit tests (application/ ≥80%, domain/ ≥80%)
npm run build
npm run test:e2e      # E2E including public-brands
```

Frontend pairing: run `scripts/ci-e2e.sh` on the paired Next.js repo.

## Gaps (operator responsibility)

| Item | Status |
|------|--------|
| WAF / DDoS protection | Deploy at CDN/load balancer |
| Penetration testing | Schedule before regulated launch |
| Data residency | Choose MySQL region per jurisdiction |
| Backup encryption | Configure at storage provider |
| SIEM integration | Forward Winston/OTEL to your stack |

## Related

- [Security](SECURITY.md)
- [Operations](OPERATIONS.md) — audit retention
- Frontend [Security](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/docs/SECURITY.md) — BFF, CSRF
