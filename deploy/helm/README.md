# Portfolio Stack Helm Chart

Deploys the NestJS API and Next.js admin frontend as a single release.

## Prerequisites

- Kubernetes 1.26+
- Helm 3.12+
- MySQL and Redis (in-cluster or external — update `values.yaml`)
- Container images pushed to GHCR (see tag CD workflow)

## Install

```bash
helm lint deploy/helm/portfolio-stack

helm upgrade --install portfolio-staging deploy/helm/portfolio-stack \
  --namespace portfolio-staging --create-namespace \
  --set api.image.tag=v2.3.0 \
  --set frontend.image.tag=v2.3.0
```

## Required secrets (before production)

Edit rendered secrets or use `--set-file` / ExternalSecrets:

| Secret | Keys |
|--------|------|
| `*-api-secrets` | `JWT_*`, `MFA_ENCRYPTION_KEY`, DB credentials |
| `*-frontend-secrets` | `API_INTERNAL_URL`, optional `SENTRY_DSN`, OTEL vars |

Default chart secrets contain **placeholder** JWT values — never deploy without rotation.

## Observability

Set in `values.yaml`:

```yaml
observability:
  otelEnabled: true
  otelEndpoint: http://otel-collector:4318/v1/traces
```

Frontend OTEL/Sentry: add to frontend Secret (see `templates/frontend-secrets.yaml` comments).

## Health probes

| Service | Path |
|---------|------|
| API | `/api/v1/health/ready`, `/api/v1/health/live` |
| Frontend | `/api/health` |

## Upgrade / rollback

```bash
helm upgrade portfolio-staging deploy/helm/portfolio-stack --set api.image.tag=v2.2.2
helm rollback portfolio-staging <revision>
```

## Validation (CI)

```bash
helm lint deploy/helm/portfolio-stack
helm template portfolio-test deploy/helm/portfolio-stack \
  --set api.enabled=true \
  --set frontend.enabled=true > /dev/null
```

## Related

- [RUNBOOK.md](../../docs/RUNBOOK.md)
- [OBSERVABILITY.md](../../docs/OBSERVABILITY.md)
- Frontend health route: `app/api/health/route.ts`
