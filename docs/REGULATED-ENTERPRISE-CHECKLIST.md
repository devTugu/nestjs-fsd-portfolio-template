# Regulated Enterprise Checklist v2.2.0

Verification gate (run before release):

```bash
# Backend
cd nestjs-fsd-portfolio-template
npm ci && npm run lint && npm run build && npm run test:cov

# Frontend
cd nextjs-fsd-portfolio-template
npm ci && node scripts/verify-lightningcss.js
npm run lint && npm run typecheck && npm run test && npm run build

# Full-stack E2E (MySQL + Redis + Keycloak)
cd nextjs-fsd-portfolio-template && bash scripts/ci-e2e.sh

# Platform
helm lint deploy/helm/portfolio-stack

# Railway smoke (post-deploy)
SMOKE_BASE_URL=https://your-frontend.up.railway.app \
API_URL=https://your-api.up.railway.app \
bash scripts/smoke-railway.sh
```

Status legend: **Done** = code + test + deploy path ready · **Partial** = opt-in / operator config · **Scaffold** = structure/doc only

## 29-item checklist

| # | Control | Status | Verified by |
|---|---------|--------|-------------|
| 1 | Clean Architecture | Done | Unit tests + ADR |
| 2 | FSD boundaries | Done | ESLint boundaries |
| 3 | JWT rotation + reuse detection | Done | `refresh-token.use-case.spec.ts` |
| 4 | OIDC SSO | Done + E2E | `e2e/oauth.spec.ts` (Keycloak) |
| 5 | TOTP MFA | Done + E2E | `e2e/mfa.spec.ts`, inline `/sign-in` enrollment |
| 6 | RBAC + cache invalidation | Done | Unit tests |
| 7 | Audit read API + meta-log | Done + E2E | `e2e/audit-logs.spec.ts` |
| 8 | BFF allowlist | Done + E2E | `e2e/bff-allowlist.spec.ts` |
| 9 | Env fail-closed | Done | `env.validation.spec.ts`, frontend `env.spec.ts` |
| 10 | CSRF enforcement | Done + E2E | `e2e/csrf.spec.ts`, `bff-csrf.spec.ts` |
| 11 | Redis rate limiting | Done | Throttler + Redis storage |
| 12 | Helmet + CSP + HSTS | Done | Backend Helmet; frontend `next.config.ts` (prod) |
| 13 | OTEL + Sentry (opt-in) | Partial | `tracing.ts`, `instrumentation.ts`, `SENTRY_DSN` |
| 14 | Structured logging | Done | Winston/logger |
| 15 | Health probes | Done | `/health/ready` |
| 16 | K8s/Helm | Partial | `helm lint` scaffold; live cluster operator-managed |
| 17 | CD + Trivy | Partial | Tag CD dry-run Helm; Railway CD workflow |
| 18 | Dependabot | Done | `.github/dependabot.yml` |
| 19 | Test pyramid | Done | 121 backend unit, 32 frontend unit, 13 E2E specs |
| 20 | E2E on PRs | Done | CI `e2e` job |
| 21 | i18n | Partial | Auth shell EN/MN on `/sign-in` |
| 22 | GDPR export/erasure | Partial | API + unit tests; cross-entity export v2.3 |
| 23 | Runbook | Done | `RUNBOOK.md` |
| 24 | SOC2 mapping | Done | `COMPLIANCE.md` |
| 25 | SBOM/Trivy on tag | Done | CD workflow |
| 26 | Secret rotation doc | Done | `RUNBOOK.md` |
| 27 | Audit retention | Done | Scheduler + `AUDIT_PURGE_ENABLED`; see `AUDIT-RETENTION.md` |
| 28 | Enterprise prompt pack | Done | `ENTERPRISE-PROMPT-PACK.md` |
| 29 | Railway production deploy | Done | `railway.toml`, Dockerfile, `docs/RAILWAY.md`, smoke script |

## Railway go-live (operator)

1. Generate secrets: `JWT_*`, `MFA_ENCRYPTION_KEY` (`openssl rand -base64 32`)
2. Deploy API + MySQL + Redis with [`.env.railway.example`](../.env.railway.example); set `RUN_SEED=true` once
3. Deploy frontend with private `API_INTERNAL_URL`
4. Set API `CORS_ORIGIN` to frontend public URL
5. Login at `/sign-in` → complete MFA enrollment
6. Set `RUN_SEED=false`; rotate default admin password
7. Run `scripts/smoke-railway.sh`
8. Optional: `SMTP_*`, `SENTRY_DSN`, `AUDIT_PURGE_ENABLED=true`

See [RAILWAY.md](RAILWAY.md) and [ENTERPRISE-PROMPT-PACK.md](ENTERPRISE-PROMPT-PACK.md).
