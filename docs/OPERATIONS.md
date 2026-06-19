# Operations

Day-2 operations: incidents, backup, observability, audit retention.

## Runbook

### API returns 503 on `/health/ready`

1. Check MySQL connectivity (`DB_HOST`, credentials, SSL)
2. Check Redis if `REDIS_ENABLED=true`
3. Review logs for connection pool exhaustion (`DB_CONNECTION_LIMIT`)

### Auth failures after deploy

1. Verify `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` unchanged (rotation invalidates all sessions)
2. Check `CORS_ORIGIN` matches frontend URL
3. Confirm Redis is reachable (refresh blacklist)

### Contact form not delivering

1. Verify `SMTP_*` and `CONTACT_NOTIFY_EMAIL`
2. Check `CONTACT_THROTTLE_*` — user may be rate-limited
3. Review `contact_messages` table for stored submissions

### MFA enrollment fails

1. Confirm `MFA_ENCRYPTION_KEY` is set and stable (changing it invalidates stored secrets)
2. Check server clock sync (TOTP window)

## Backup and restore

### MySQL

```bash
mysqldump -h $DB_HOST -u $DB_USERNAME -p$DB_PASSWORD $DB_NAME > backup.sql
mysql -h $DB_HOST -u $DB_USERNAME -p$DB_PASSWORD $DB_NAME < backup.sql
```

Schedule daily backups in production. Test restore quarterly.

### Redis

Redis holds ephemeral data (throttle counters, permission cache, refresh blacklist). No backup required; data rebuilds on use.

## Observability

| Signal | Config |
|--------|--------|
| Structured logs | Winston via `LOG_LEVEL` |
| Error tracking | `SENTRY_DSN` |
| Tracing | `OTEL_ENABLED=true`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME` |

Correlate requests via `requestId` in API responses and log entries.

## Audit retention

| Env | Default | Purpose |
|-----|---------|---------|
| `AUDIT_PURGE_ENABLED` | `false` | Enable scheduled purge |
| `AUDIT_RETENTION_DAYS` | `90` | Days to retain audit rows |

When purge is enabled, a scheduler removes `audit_logs` older than retention period. Export audit data before enabling purge in regulated environments.

## Dashboard stats

`GET /admin/dashboard/stats` returns v3 counts: `brands`, `history`, `news`, `contactMessages` (+ optional RBAC counts).

## Related

- [Deployment](DEPLOYMENT.md)
- [Compliance](COMPLIANCE.md)
