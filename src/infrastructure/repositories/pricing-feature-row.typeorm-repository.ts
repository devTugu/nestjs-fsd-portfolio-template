import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePricingFeatureRowData,
  IPricingFeatureRowRepository,
  ListPricingFeatureRowsQuery,
  UpdatePricingFeatureRowData,
} from '@domain/pricing/repositories/pricing-feature-row.repository.interface';
import { PricingFeatureRow as DomainPricingFeatureRow } from '@domain/pricing/entities/pricing-feature-row.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { PricingFeatureRowEntity } from '../database/typeorm/entities/pricing-feature-row.entity';
import { PricingFeatureRowMapper } from '../database/typeorm/mappers/pricing-feature-row.mapper';

@Injectable()
export class PricingFeatureRowTypeOrmRepository implements IPricingFeatureRowRepository {
  constructor(
    @InjectRepository(PricingFeatureRowEntity)
    private readonly repository: Repository<PricingFeatureRowEntity>,
  ) {}

  async create(
    data: CreatePricingFeatureRowData,
  ): Promise<DomainPricingFeatureRow> {
    const saved = await this.repository.save(
      this.repository.create({
        productName: data.productName,
        starterValue: data.starterValue,
        proValue: data.proValue,
        enterpriseValue: data.enterpriseValue,
        sortOrder: data.sortOrder ?? 0,
      }),
    );
    return PricingFeatureRowMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainPricingFeatureRow | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? PricingFeatureRowMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListPricingFeatureRowsQuery,
  ): Promise<PaginatedResult<DomainPricingFeatureRow>> {
    const { page = 1, limit = 50 } = query;
    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return {
      items: items.map((r) => PricingFeatureRowMapper.toDomain(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllOrdered(): Promise<DomainPricingFeatureRow[]> {
    const items = await this.repository.find({
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return items.map((r) => PricingFeatureRowMapper.toDomain(r));
  }

  async update(
    id: number,
    data: UpdatePricingFeatureRowData,
  ): Promise<DomainPricingFeatureRow> {
    const entity = await this.repository.findOneOrFail({ where: { id } });
    if (data.productName !== undefined) entity.productName = data.productName;
    if (data.starterValue !== undefined)
      entity.starterValue = data.starterValue;
    if (data.proValue !== undefined) entity.proValue = data.proValue;
    if (data.enterpriseValue !== undefined)
      entity.enterpriseValue = data.enterpriseValue;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    const saved = await this.repository.save(entity);
    return PricingFeatureRowMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
