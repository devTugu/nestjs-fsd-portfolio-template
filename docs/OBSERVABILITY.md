# Observability (Backend API)

Opt-in OpenTelemetry tracing and Sentry error tracking for the NestJS portfolio API.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OTEL_ENABLED` | `false` | Set `true` to export traces via OTLP HTTP |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `http://localhost:4318/v1/traces` | Collector ingest URL |
| `OTEL_SERVICE_NAME` | `portfolio-api` | Trace resource service name |
| `SENTRY_DSN` | (unset) | Optional Sentry DSN for unhandled exceptions |

See [`.env.railway.example`](../.env.railway.example) and [`.env.example`](../.env.example).

## Bootstrap

[`tracing.ts`](../src/infrastructure/observability/tracing.ts) is invoked from `main.ts` before Nest bootstrap. When disabled, no SDK is started.

Helm sets OTEL env from chart values:

```yaml
observability:
  otelEnabled: true
  otelEndpoint: http://otel-collector:4318/v1/traces
```

## Collector options

| Deployment | Pattern |
|------------|---------|
| Kubernetes | Sidecar or cluster `otel-collector` Service on port 4318 |
| Railway | External managed OTLP endpoint (HTTPS) |
| Local dev | `docker run` OpenTelemetry Collector contrib image |

## Railway production profile

```env
OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=https://otel-collector.example.com/v1/traces
OTEL_SERVICE_NAME=portfolio-api
SENTRY_DSN=https://example@sentry.io/project
LOG_LEVEL=info
```

## Verification

```bash
npm run test -- src/infrastructure/observability/tracing.spec.ts
curl -sf http://localhost:3001/api/v1/health/ready
```

## Related

- Frontend [OBSERVABILITY.md](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/docs/OBSERVABILITY.md)
- [PRODUCTION.md](./PRODUCTION.md)
- [REGULATED-ENTERPRISE-CHECKLIST.md](./REGULATED-ENTERPRISE-CHECKLIST.md)
