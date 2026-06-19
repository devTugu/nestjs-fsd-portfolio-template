import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  CreatePricingPlanData,
  IPricingPlanRepository,
  ListPricingPlansQuery,
  UpdatePricingPlanData,
} from '@domain/pricing/repositories/pricing-plan.repository.interface';
import { PricingPlan as DomainPricingPlan } from '@domain/pricing/entities/pricing-plan.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { PricingPlanEntity } from '../database/typeorm/entities/pricing-plan.entity';
import { PricingPlanMapper } from '../database/typeorm/mappers/pricing-plan.mapper';

@Injectable()
export class PricingPlanTypeOrmRepository implements IPricingPlanRepository {
  constructor(
    @InjectRepository(PricingPlanEntity)
    private readonly repository: Repository<PricingPlanEntity>,
  ) {}

  async create(data: CreatePricingPlanData): Promise<DomainPricingPlan> {
    const saved = await this.repository.save(
      this.repository.create({
        slug: data.slug,
        name: data.name,
        description: data.description,
        priceLabel: data.priceLabel,
        priceNote: data.priceNote ?? null,
        features: data.features,
        ctaLabel: data.ctaLabel,
        ctaUrl: data.ctaUrl,
        isHighlighted: data.isHighlighted ?? false,
        sortOrder: data.sortOrder ?? 0,
        isPublished: data.isPublished ?? false,
      }),
    );
    return PricingPlanMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainPricingPlan | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? PricingPlanMapper.toDomain(entity) : null;
  }

  async findBySlug(slug: string): Promise<DomainPricingPlan | null> {
    const entity = await this.repository.findOne({
      where: { slug, deletedAt: IsNull() },
    });
    return entity ? PricingPlanMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListPricingPlansQuery,
  ): Promise<PaginatedResult<DomainPricingPlan>> {
    const { page = 1, limit = 20, publishedOnly } = query;
    const where: Record<string, unknown> = { deletedAt: IsNull() };
    if (publishedOnly !== undefined) where.isPublished = publishedOnly;
    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return {
      items: items.map((p) => PricingPlanMapper.toDomain(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllPublished(): Promise<DomainPricingPlan[]> {
    const items = await this.repository.find({
      where: { isPublished: true, deletedAt: IsNull() },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return items.map((p) => PricingPlanMapper.toDomain(p));
  }

  async update(
    id: number,
    data: UpdatePricingPlanData,
  ): Promise<DomainPricingPlan> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.slug !== undefined) entity.slug = data.slug;
    if (data.name !== undefined) entity.name = data.name;
    if (data.description !== undefined) entity.description = data.description;
    if (data.priceLabel !== undefined) entity.priceLabel = data.priceLabel;
    if (data.priceNote !== undefined) entity.priceNote = data.priceNote;
    if (data.features !== undefined) entity.features = data.features;
    if (data.ctaLabel !== undefined) entity.ctaLabel = data.ctaLabel;
    if (data.ctaUrl !== undefined) entity.ctaUrl = data.ctaUrl;
    if (data.isHighlighted !== undefined)
      entity.isHighlighted = data.isHighlighted;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    if (data.isPublished !== undefined) entity.isPublished = data.isPublished;
    const saved = await this.repository.save(entity);
    return PricingPlanMapper.toDomain(saved);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.repository.findOneOrFail({ where: { id } });
    await this.repository.softRemove(entity);
  }

  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const qb = this.repository
      .createQueryBuilder('p')
      .where('p.slug = :slug', { slug })
      .withDeleted();
    if (excludeId !== undefined) {
      qb.andWhere('p.id != :excludeId', { excludeId });
    }
    const count = await qb.getCount();
    return count > 0;
  }
}
