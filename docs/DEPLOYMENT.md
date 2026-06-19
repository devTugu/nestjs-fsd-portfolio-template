# Deployment

Production deployment guide for the NestJS API.

## Environment checklist

| Category | Required | Notes |
|----------|----------|-------|
| `NODE_ENV` | `production` | |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Yes | Rotate periodically |
| `DB_*` | Yes | MySQL 8; set `DB_SSL=true` for managed DB |
| `CORS_ORIGIN` | Yes | Frontend origin only |
| `REDIS_URL` | Recommended | Shared throttle + permission cache |
| `MFA_ENCRYPTION_KEY` | Recommended | Required if MFA enabled |
| `SWAGGER_ENABLED` | `false` | Enable only in staging |
| `SENTRY_DSN` | Optional | Error tracking |
| `OTEL_ENABLED` | Optional | Distributed tracing |

Full schema: `src/infrastructure/config/env.validation.ts`

## Docker

```bash
docker build -t nestjs-re-api .
docker run -p 3001:3000 --env-file .env nestjs-re-api
```

The container runs migrations on start when using `scripts/railway-start.sh` with `RUN_SEED=true` for first deploy.

## Railway

1. Create MySQL + Redis services
2. Deploy API service from repo root
3. Set env vars from `.env.example`
4. Set `RUN_SEED=true` on first deploy, then `false`
5. Set `CORS_ORIGIN` to your frontend Railway/Vercel URL

`railway.toml` configures build and start commands.

## Health probes

| Probe | Path | Use |
|-------|------|-----|
| Liveness | `/api/v1/health/live` | Process up |
| Readiness | `/api/v1/health/ready` | DB + Redis connected |

## SMTP (contact notifications)

Optional but recommended for production contact forms:

```
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
CONTACT_NOTIFY_EMAIL
CONTACT_EMAIL_SUBJECT_PREFIX
```

Auto-reply to submitters uses the same SMTP transport when configured.

## S3 media upload

Optional S3-compatible storage for admin media uploads:

```
S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY
S3_ENDPOINT, S3_PUBLIC_BASE_URL
```

Without S3, use URL fields in CMS entities directly.

## Production verification

```bash
npm run test
npm run build
curl -f https://api.example.com/api/v1/health/ready
```

Pair with frontend `scripts/smoke-railway.sh` for full-stack smoke test.

## Related

- [Operations](OPERATIONS.md) — incidents, backup
- [Security](SECURITY.md) — hardening
