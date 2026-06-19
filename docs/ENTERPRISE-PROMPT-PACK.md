# Enterprise Prompt Pack

Reusable prompts for forked projects. Copy this file when starting a new regulated-enterprise deployment.

## Meta-prompt (Agent mode)

```
CONTEXT: NestJS Clean Architecture + Next.js FSD portfolio templates v2.0.0.
GOAL: [Describe phase or feature]

CONSTRAINTS:
- Preserve Clean Architecture / FSD boundaries
- Env fail-closed in production
- Tests for security-sensitive changes
- ADR for architectural decisions
- Conventional commits

DEFINITION OF DONE:
- lint + build + test pass both repos
- docs/SECURITY.md updated if auth changes
- docs/contracts/api-envelope.md permission sync if RBAC changes

VERIFICATION:
cd nestjs-fsd-portfolio-template && npm ci && npm run lint && npm run test:cov && npm run build
cd nextjs-fsd-portfolio-template && npm ci && npm run lint && npm run typecheck && npm run test && npm run build
```

## Phase checklist

| Phase | Verify |
|-------|--------|
| 0 | Invalid env fails startup; `.env.example` matches BFF model |
| 1 | BFF allowlist rejects unknown paths; audit logs readable |
| 2 | OTEL_ENABLED exports traces; E2E on PR |
| 3 | `helm lint deploy/helm/portfolio-stack`; Trivy passes on tag |
| 4 | MFA enroll E2E; OIDC when OAUTH_ENABLED=true |
| 5 | CSRF on BFF POST; GDPR export returns JSON |

## Regulated enterprise checklist (28 items)

See [COMPLIANCE.md](COMPLIANCE.md) for SOC2 mapping.

1. Clean Architecture enforced
2. FSD boundaries enforced
3. JWT rotation + reuse detection
4. OIDC SSO (optional, OAUTH_ENABLED)
5. TOTP MFA
6. RBAC + permission cache invalidation
7. Audit write + read API
8. BFF allowlist
9. Env fail-closed
10. CSRF defense (BFF)
11. Redis-backed rate limiting
12. Helmet + CSP + HSTS
13. OTEL tracing
14. Structured logging + x-request-id
15. Health live/ready probes
16. K8s/Helm chart
17. CD pipeline + Trivy
18. Dependabot
19. Test pyramid (unit + e2e)
20. E2E on PRs
21. i18n scaffold + CMS LocalizedText (ADR 012)
22. GDPR export/erasure
23. Runbook
24. SOC2 compliance doc
25. SBOM/Trivy on release
26. Secret rotation procedure (RUNBOOK)
27. Audit retention policy
28. ENTERPRISE-PROMPT-PACK (this file)

## Fork customization

| File | Customize |
|------|-----------|
| `permissions.const.ts` / `permissions.ts` | Your RBAC matrix |
| `deploy/helm/portfolio-stack/values.yaml` | Host, replicas, images |
| `.env.example` | Domain URLs, secrets template |
| `docs/adr/005-portfolio-cms.md` | Add/remove CMS modules |
| `docs/adr/012-cms-localized-content.md` | LocalizedText for new CMS entities |
