# Backup and Restore

## MySQL backup (production)

```bash
mysqldump -h $DB_HOST -u $DB_USERNAME -p$DB_PASSWORD \
  --single-transaction --routines --triggers $DB_NAME \
  > backup-$(date +%Y%m%d-%H%M).sql
```

Store encrypted backups off-site (S3 with SSE, retention 30+ days).

## Restore

```bash
mysql -h $DB_HOST -u $DB_USERNAME -p$DB_PASSWORD $DB_NAME < backup.sql
npm run migration:run
```

## Redis

Redis holds ephemeral data (token blacklist, permission cache, rate limits). No backup required — rebuild on restart.

## Audit logs

Export via admin API or direct SQL for compliance archives:

```sql
SELECT * FROM audit_logs WHERE created_at >= '2026-01-01' ORDER BY created_at;
```

See [AUDIT-RETENTION.md](AUDIT-RETENTION.md).
