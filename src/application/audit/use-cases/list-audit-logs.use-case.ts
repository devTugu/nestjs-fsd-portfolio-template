import { Inject, Injectable } from '@nestjs/common';
import {
  IAuditLogRepository,
  ListAuditLogsQuery,
} from '@application/ports/audit-log.port';
import { AuditLogOutput } from '../dto/audit-log-output.mapper';
import { toAuditLogOutput } from '../dto/audit-log-output.mapper';
import { PaginatedResult } from '@shared/types/pagination';
import { AUDIT_LOG_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class ListAuditLogsUseCase {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogs: IAuditLogRepository,
  ) {}

  async execute(
    query: ListAuditLogsQuery,
  ): Promise<PaginatedResult<AuditLogOutput>> {
    const result = await this.auditLogs.findAll(query);
    return {
      ...result,
      items: result.items.map((item) => toAuditLogOutput(item)),
    };
  }
}
