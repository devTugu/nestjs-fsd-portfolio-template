# Incident Runbook

## Severity levels

| Level | Response time | Examples |
|-------|---------------|----------|
| SEV1 | 15 min | API down, auth broken, data breach |
| SEV2 | 1 hour | Elevated 5xx, Redis down |
| SEV3 | Next business day | Non-critical feature degraded |

## API unavailable

1. Check probes: `GET /api/v1/health/live`, `GET /api/v1/health/ready`
2. Verify MySQL and Redis connectivity
3. Review pod logs: `kubectl logs deploy/<release>-portfolio-api`
4. Roll back: `helm rollback portfolio-staging <revision>`

## Auth failures spike

1. Confirm Redis (`REDIS_ENABLED=true`) for blacklist + permission cache
2. Check JWT secret rotation — all replicas must share secrets
3. Review audit logs: `GET /api/v1/admin/audit-logs?action=LOGIN_FAILED`

## Secret rotation

1. Generate new JWT secrets (32+ chars)
2. Update K8s secret / ExternalSecret
3. Rolling restart API deployment
4. Force user re-login (refresh tokens invalidated on secret change if configured)

## Helm deploy (staging / production)

1. Build and push tagged images (`portfolio-api`, `portfolio-admin`) — see CD workflow
2. Lint chart: `helm lint deploy/helm/portfolio-stack`
3. Install or upgrade:
   ```bash
   helm upgrade --install portfolio-staging deploy/helm/portfolio-stack \
     --namespace portfolio-staging --create-namespace \
     --set api.image.tag=vX.Y.Z \
     --set frontend.image.tag=vX.Y.Z
   ```
4. Verify probes: API `/api/v1/health/ready`, frontend `/api/health`
5. Roll back on failure: `helm rollback portfolio-staging <revision>`

See [deploy/helm/README.md](../deploy/helm/README.md).

## Contacts

- On-call: configure in your org
- Escalation: platform lead / security team
