# Audit Log Retention

## Policy

- **Retention:** 90 days online (configurable via cron job)
- **Archive:** Export to cold storage (S3/Glacier) before purge
- **PII:** Audit logs may contain `userId`, `ipAddress` — treat as personal data under GDPR

## Purge job (operator)

```sql
DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

Schedule via K8s CronJob or managed DB event.

## Admin access

Requires `AUDIT_READ` permission. All reads should be logged (future enhancement).

## SIEM export

Forward OTEL logs or poll `GET /api/v1/admin/audit-logs` on interval for SIEM ingestion.
