# Audit Log Retention

## Policy

- **Retention:** 90 days online (default; configurable via `AUDIT_RETENTION_DAYS`)
- **Archive:** Export to cold storage (S3/Glacier) before purge (operator responsibility)
- **PII:** Audit logs may contain `userId`, `ipAddress` — treat as personal data under GDPR

## Automated purge (API)

When enabled in production:

```env
AUDIT_PURGE_ENABLED=true
AUDIT_RETENTION_DAYS=90
NODE_ENV=production
```

The API runs a daily scheduler (`AuditRetentionScheduler`) at 03:00 UTC and deletes rows older than the retention window.

Implementation: `PurgeAuditLogsUseCase`, `audit-retention.scheduler.ts`.

## Manual purge (operator fallback)

```sql
DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

Use for one-off cleanup or when scheduler is disabled.

## Railway

Set `AUDIT_PURGE_ENABLED=true` on the API service after go-live. See [RAILWAY.md](RAILWAY.md).

## Admin access

Requires `AUDIT_READ` permission. Listing audit logs writes a meta-audit record (`AUDIT_LOG_READ`).

## SIEM export

Forward OTEL logs or poll `GET /api/v1/admin/audit-logs` on interval for SIEM ingestion.
