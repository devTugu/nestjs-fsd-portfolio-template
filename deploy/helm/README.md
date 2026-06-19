# RE CMS Stack Helm Chart

Deploys the NestJS API and Next.js admin frontend as a single release.

## Prerequisites

- Kubernetes 1.26+
- Helm 3.12+
- MySQL and Redis (in-cluster or external — update `values.yaml`)
- Container images pushed to GHCR (see tag CD workflow)

## Install

```bash
helm lint deploy/helm/re-cms-stack

helm upgrade --install re-cms-staging deploy/helm/re-cms-stack \
  --namespace re-cms-staging --create-namespace \
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
helm upgrade re-cms-staging deploy/helm/re-cms-stack --set api.image.tag=v3.0.0
helm rollback re-cms-staging <revision>
```

## Migrating from `portfolio-stack`

Previous releases used `deploy/helm/portfolio-stack` and image names `portfolio-api` / `portfolio-admin`. Install `re-cms-stack` with updated image tags (`re-cms-api`, `re-cms-admin`) or migrate the release in place by updating chart path and values.

Keycloak local dev realm id remains `portfolio` for backward compatibility; OAuth client id is `re-cms-admin` (was `portfolio-admin`). Set `OAUTH_CLIENT_ID=re-cms-admin` in API `.env`.

## Validation (CI)

```bash
helm lint deploy/helm/re-cms-stack
helm template re-cms-test deploy/helm/re-cms-stack \
  --set api.enabled=true \
  --set frontend.enabled=true > /dev/null
```

## Related

- [Operations](../../docs/OPERATIONS.md)
- [Deployment](../../docs/DEPLOYMENT.md)
- Frontend health route: `app/api/health/route.ts`
