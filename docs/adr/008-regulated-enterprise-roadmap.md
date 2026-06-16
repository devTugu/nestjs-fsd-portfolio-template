# ADR 008: Regulated Enterprise Roadmap

## Status

Accepted

## Context

The portfolio template pair (NestJS API + Next.js admin) reached production-ready starter quality (~72% enterprise). To serve regulated environments (SOC2-ready foundation) and be reusable across client projects, a phased upgrade was defined.

## Decision

Implement six phases:

| Phase | Focus | Outcome |
|-------|-------|---------|
| 0 | Foundation | Env fail-closed, doc sync, shared API contract |
| 1 | P0 Security | BFF allowlist, RBAC/cache fixes, audit read API |
| 2 | P1 Quality | OTEL observability, test pyramid, CI hardening |
| 3 | P2 Platform | K8s/Helm, CD pipeline, container scanning, runbooks |
| 4 | P2 Identity | Generic OIDC SSO + TOTP MFA |
| 5 | P2 Global | i18n, CSRF, GDPR export/erasure, prompt pack |

**Deploy standard:** Docker + Kubernetes/Helm (cloud-agnostic) + **Railway** (managed PaaS).

**Identity standard:** Generic OIDC/OAuth2 + TOTP MFA (inline enrollment on `/sign-in`).

## v2.2 additions (Railway production)

- `railway.toml`, Dockerfiles, `.env.railway.example`, `docs/RAILWAY.md`
- GitHub Actions `railway-deploy.yml` (when secrets configured)
- Audit retention scheduler (`AUDIT_PURGE_ENABLED`)
- Sentry opt-in (`SENTRY_DSN`)
- Auth shell i18n (EN/MN on sign-in)
- Checklist v2.2: [REGULATED-ENTERPRISE-CHECKLIST.md](https://github.com/devTugu/nestjs-fsd-portfolio-template/blob/main/docs/REGULATED-ENTERPRISE-CHECKLIST.md)

## Consequences

### Positive

- Fork-once, deploy-anywhere platform
- Compliance artifacts (audit read, retention docs, SOC2 mapping)
- Single source of truth for API envelope and permission codes

### Negative

- Increased operational complexity (Helm, OTEL collector)
- Identity phase adds migration and UX steps (MFA enroll)

## Verification gate

```bash
npm ci && npm run lint && npm run build && npm run test:cov && npm run test:e2e
```

Railway post-deploy: `scripts/smoke-railway.sh` (frontend repo).

See `docs/contracts/api-envelope.md` and `docs/REGULATED-ENTERPRISE-CHECKLIST.md`.

## Related

- Frontend mirror: `nextjs-fsd-portfolio-template/docs/adr/008-regulated-enterprise-roadmap.md`
- [SECURITY.md](../SECURITY.md)
- [PRODUCTION.md](../PRODUCTION.md)
