import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  AuditLogEntry,
  AuditLogRecord,
  IAuditLogRepository,
  ListAuditLogsQuery,
} from '@application/ports/audit-log.port';
import { AuditLog } from '../database/typeorm/entities/audit-log.entity';

@Injectable()
export class AuditLogTypeOrmRepository implements IAuditLogRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repository: Repository<AuditLog>,
  ) {}

  async save(record: AuditLogRecord): Promise<void> {
    await this.repository.save(
      this.repository.create({
        userId: record.userId,
        action: record.action,
        resource: record.resource,
        resourceId: record.resourceId,
        ipAddress: record.ipAddress,
        metadata: record.metadata,
      }),
    );
  }

  async findAll(query: ListAuditLogsQuery) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where: Record<string, unknown> = {};

    if (query.userId !== undefined) {
      where.userId = query.userId;
    }
    if (query.resource) {
      where.resource = query.resource;
    }
    if (query.action) {
      where.action = query.action;
    }
    if (query.from && query.to) {
      where.createdAt = Between(query.from, query.to);
    } else if (query.from) {
      where.createdAt = MoreThanOrEqual(query.from);
    } else if (query.to) {
      where.createdAt = LessThanOrEqual(query.to);
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map((item) => this.toEntry(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  private toEntry(entity: AuditLog): AuditLogEntry {
    return {
      id: entity.id,
      userId: entity.userId,
      action: entity.action,
      resource: entity.resource,
      resourceId: entity.resourceId,
      ipAddress: entity.ipAddress,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
    };
  }
}
