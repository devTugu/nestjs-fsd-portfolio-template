import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  CreateHistoryEntryData,
  IHistoryEntryRepository,
  ListHistoryEntriesQuery,
  UpdateHistoryEntryData,
} from '@domain/history/repositories/history-entry.repository.interface';
import { HistoryEntry as DomainHistoryEntry } from '@domain/history/entities/history-entry.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { HistoryEntryEntity } from '../database/typeorm/entities/multi-brand.entity';
import { HistoryEntryMapper } from '../database/typeorm/mappers/multi-brand.mapper';

@Injectable()
export class HistoryEntryTypeOrmRepository implements IHistoryEntryRepository {
  constructor(
    @InjectRepository(HistoryEntryEntity)
    private readonly repository: Repository<HistoryEntryEntity>,
  ) {}

  async create(data: CreateHistoryEntryData): Promise<DomainHistoryEntry> {
    const saved = await this.repository.save(
      this.repository.create({
        year: data.year,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl ?? null,
        sortOrder: data.sortOrder ?? 0,
        isPublished: data.isPublished ?? true,
      }),
    );
    return HistoryEntryMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainHistoryEntry | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? HistoryEntryMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListHistoryEntriesQuery,
  ): Promise<PaginatedResult<DomainHistoryEntry>> {
    const { page = 1, limit = 50 } = query;
    const [items, total] = await this.repository.findAndCount({
      where: { deletedAt: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
      order: { year: 'DESC', sortOrder: 'ASC' },
    });
    return {
      items: items.map((h) => HistoryEntryMapper.toDomain(h)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllPublished(): Promise<DomainHistoryEntry[]> {
    const items = await this.repository.find({
      where: { isPublished: true, deletedAt: IsNull() },
      order: { year: 'DESC', sortOrder: 'ASC' },
    });
    return items.map((h) => HistoryEntryMapper.toDomain(h));
  }

  async update(
    id: number,
    data: UpdateHistoryEntryData,
  ): Promise<DomainHistoryEntry> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.year !== undefined) entity.year = data.year;
    if (data.title !== undefined) entity.title = data.title;
    if (data.description !== undefined) entity.description = data.description;
    if (data.imageUrl !== undefined) entity.imageUrl = data.imageUrl;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    if (data.isPublished !== undefined) entity.isPublished = data.isPublished;
    const saved = await this.repository.save(entity);
    return HistoryEntryMapper.toDomain(saved);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    await this.repository.softRemove(entity);
  }
}
