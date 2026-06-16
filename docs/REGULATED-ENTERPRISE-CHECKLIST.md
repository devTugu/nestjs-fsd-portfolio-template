# Regulated Enterprise Checklist v2.0.0

Verification gate (run before release):

```bash
# Backend
cd nestjs-fsd-portfolio-template
npm ci && npm run lint && npm run build && npm run test:cov

# Frontend
cd nextjs-fsd-portfolio-template
npm ci && npm run lint && npm run typecheck && npm run test && npm run build

# Platform
helm lint deploy/helm/portfolio-stack
```

## 28-item checklist

| # | Control | v2.0.0 |
|---|---------|--------|
| 1 | Clean Architecture | Done |
| 2 | FSD boundaries | Done |
| 3 | JWT rotation + reuse detection | Done |
| 4 | OIDC SSO | Done (OAUTH_ENABLED) |
| 5 | TOTP MFA | Done |
| 6 | RBAC + cache invalidation | Done |
| 7 | Audit read API | Done |
| 8 | BFF allowlist | Done |
| 9 | Env fail-closed | Done |
| 10 | CSRF utilities | Done (src/shared/lib/csrf.ts) |
| 11 | Redis rate limiting | Done |
| 12 | Helmet + CSP + HSTS | Done |
| 13 | OTEL tracing | Done |
| 14 | Structured logging | Done |
| 15 | Health probes | Done |
| 16 | K8s/Helm | Done |
| 17 | CD + Trivy | Done |
| 18 | Dependabot | Done |
| 19 | Test pyramid | Done |
| 20 | E2E on PRs | Done |
| 21 | i18n scaffold | Done |
| 22 | GDPR export/erasure | Done |
| 23 | Runbook | Done |
| 24 | SOC2 mapping | Done |
| 25 | SBOM/Trivy on tag | Done |
| 26 | Secret rotation doc | Done (RUNBOOK) |
| 27 | Audit retention | Done |
| 28 | Enterprise prompt pack | Done |

See [ENTERPRISE-PROMPT-PACK.md](ENTERPRISE-PROMPT-PACK.md).
