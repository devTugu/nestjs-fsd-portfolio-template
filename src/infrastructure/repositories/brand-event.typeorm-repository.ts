import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  CreateBrandEventData,
  IBrandEventRepository,
  ListBrandEventsQuery,
  UpdateBrandEventData,
} from '@domain/brand/repositories/brand-event.repository.interface';
import { BrandEvent as DomainBrandEvent } from '@domain/brand/entities/brand-event.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { BrandEventEntity } from '../database/typeorm/entities/multi-brand.entity';
import { BrandEventMapper } from '../database/typeorm/mappers/multi-brand.mapper';

@Injectable()
export class BrandEventTypeOrmRepository implements IBrandEventRepository {
  constructor(
    @InjectRepository(BrandEventEntity)
    private readonly repository: Repository<BrandEventEntity>,
  ) {}

  async create(data: CreateBrandEventData): Promise<DomainBrandEvent> {
    const saved = await this.repository.save(
      this.repository.create({
        brandId: data.brandId,
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        location: data.location,
        imageUrl: data.imageUrl ?? null,
        sortOrder: data.sortOrder ?? 0,
        isPublished: data.isPublished ?? true,
      }),
    );
    return BrandEventMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainBrandEvent | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? BrandEventMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListBrandEventsQuery,
  ): Promise<PaginatedResult<DomainBrandEvent>> {
    const { page = 1, limit = 50, brandId } = query;
    const where: Record<string, unknown> = { deletedAt: IsNull() };
    if (brandId) where.brandId = brandId;
    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { eventDate: 'ASC', sortOrder: 'ASC' },
    });
    return {
      items: items.map((e) => BrandEventMapper.toDomain(e)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPublishedByBrandId(brandId: number): Promise<DomainBrandEvent[]> {
    const items = await this.repository.find({
      where: { brandId, isPublished: true, deletedAt: IsNull() },
      order: { eventDate: 'ASC', sortOrder: 'ASC' },
    });
    return items.map((e) => BrandEventMapper.toDomain(e));
  }

  async update(
    id: number,
    data: UpdateBrandEventData,
  ): Promise<DomainBrandEvent> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.title !== undefined) entity.title = data.title;
    if (data.description !== undefined) entity.description = data.description;
    if (data.eventDate !== undefined) entity.eventDate = data.eventDate;
    if (data.location !== undefined) entity.location = data.location;
    if (data.imageUrl !== undefined) entity.imageUrl = data.imageUrl;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    if (data.isPublished !== undefined) entity.isPublished = data.isPublished;
    const saved = await this.repository.save(entity);
    return BrandEventMapper.toDomain(saved);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    await this.repository.softRemove(entity);
  }
}
