import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  CreateBrandData,
  IBrandRepository,
  ListBrandsQuery,
  UpdateBrandData,
} from '@domain/brand/repositories/brand.repository.interface';
import { Brand as DomainBrand } from '@domain/brand/entities/brand.entity';
import { BrandType } from '@domain/brand/entities/brand-type';
import { PaginatedResult } from '@shared/types/pagination';
import { BrandEntity } from '../database/typeorm/entities/multi-brand.entity';
import { BrandMapper } from '../database/typeorm/mappers/multi-brand.mapper';

@Injectable()
export class BrandTypeOrmRepository implements IBrandRepository {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly repository: Repository<BrandEntity>,
  ) {}

  async create(data: CreateBrandData): Promise<DomainBrand> {
    const saved = await this.repository.save(
      this.repository.create({
        slug: data.slug!,
        type: data.type,
        name: data.name,
        description: data.description,
        logoUrl: data.logoUrl ?? null,
        coverImageUrl: data.coverImageUrl ?? null,
        address: data.address ?? null,
        phone: data.phone ?? null,
        mapEmbed: data.mapEmbed ?? null,
        socialLinks: data.socialLinks ?? [],
        workHours: data.workHours ?? null,
        sortOrder: data.sortOrder ?? 0,
        isPublished: data.isPublished ?? false,
        publishedAt: data.isPublished ? new Date() : null,
      }),
    );
    return BrandMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainBrand | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? BrandMapper.toDomain(entity) : null;
  }

  async findBySlug(slug: string): Promise<DomainBrand | null> {
    const entity = await this.repository.findOne({
      where: { slug, deletedAt: IsNull() },
    });
    return entity ? BrandMapper.toDomain(entity) : null;
  }

  async findPublishedBySlug(slug: string): Promise<DomainBrand | null> {
    const entity = await this.repository.findOne({
      where: { slug, isPublished: true, deletedAt: IsNull() },
    });
    return entity ? BrandMapper.toDomain(entity) : null;
  }

  async findAll(query: ListBrandsQuery): Promise<PaginatedResult<DomainBrand>> {
    const { page = 1, limit = 20, search, type } = query;
    const qb = this.repository
      .createQueryBuilder('brand')
      .where('brand.deleted_at IS NULL');
    if (type) qb.andWhere('brand.type = :type', { type });
    if (search) {
      qb.andWhere(
        "(JSON_UNQUOTE(JSON_EXTRACT(brand.name, '$.en')) LIKE :search OR brand.slug LIKE :search)",
        { search: `%${search}%` },
      );
    }
    const [items, total] = await qb
      .orderBy('brand.sort_order', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return {
      items: items.map((b) => BrandMapper.toDomain(b)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllPublished(
    type?: BrandType,
    limit?: number,
  ): Promise<DomainBrand[]> {
    const qb = this.repository
      .createQueryBuilder('brand')
      .where('brand.is_published = :published', { published: true })
      .andWhere('brand.deleted_at IS NULL')
      .orderBy('brand.sort_order', 'ASC');
    if (type) qb.andWhere('brand.type = :type', { type });
    if (limit) qb.take(limit);
    const items = await qb.getMany();
    return items.map((b) => BrandMapper.toDomain(b));
  }

  async update(id: number, data: UpdateBrandData): Promise<DomainBrand> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.slug !== undefined) entity.slug = data.slug;
    if (data.type !== undefined) entity.type = data.type;
    if (data.name !== undefined) entity.name = data.name;
    if (data.description !== undefined) entity.description = data.description;
    if (data.logoUrl !== undefined) entity.logoUrl = data.logoUrl;
    if (data.coverImageUrl !== undefined)
      entity.coverImageUrl = data.coverImageUrl;
    if (data.address !== undefined) entity.address = data.address;
    if (data.phone !== undefined) entity.phone = data.phone;
    if (data.mapEmbed !== undefined) entity.mapEmbed = data.mapEmbed;
    if (data.socialLinks !== undefined) entity.socialLinks = data.socialLinks;
    if (data.workHours !== undefined) entity.workHours = data.workHours;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    if (data.isPublished !== undefined) {
      entity.isPublished = data.isPublished;
      entity.publishedAt = data.isPublished ? new Date() : null;
    }
    const saved = await this.repository.save(entity);
    return BrandMapper.toDomain(saved);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    await this.repository.softRemove(entity);
  }

  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const qb = this.repository
      .createQueryBuilder('brand')
      .where('brand.slug = :slug', { slug })
      .andWhere('brand.deleted_at IS NULL');
    if (excludeId) qb.andWhere('brand.id != :excludeId', { excludeId });
    const count = await qb.getCount();
    return count > 0;
  }
}
