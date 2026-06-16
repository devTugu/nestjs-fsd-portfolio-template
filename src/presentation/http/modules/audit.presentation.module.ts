import { Module } from '@nestjs/common';
import { AuditLogAdminV1Controller } from '../controllers/v1/admin/audit-log.controller';
import { ListAuditLogsUseCase } from '@application/audit/use-cases/list-audit-logs.use-case';

@Module({
  controllers: [AuditLogAdminV1Controller],
  providers: [ListAuditLogsUseCase],
})
export class AuditPresentationModule {}
