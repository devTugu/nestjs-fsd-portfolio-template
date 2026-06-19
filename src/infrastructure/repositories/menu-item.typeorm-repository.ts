import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  CreateMenuItemData,
  IMenuItemRepository,
  ListMenuItemsQuery,
  UpdateMenuItemData,
} from '@domain/brand/repositories/menu-item.repository.interface';
import { MenuItem as DomainMenuItem } from '@domain/brand/entities/menu-item.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { MenuItemEntity } from '../database/typeorm/entities/multi-brand.entity';
import { MenuItemMapper } from '../database/typeorm/mappers/multi-brand.mapper';

@Injectable()
export class MenuItemTypeOrmRepository implements IMenuItemRepository {
  constructor(
    @InjectRepository(MenuItemEntity)
    private readonly repository: Repository<MenuItemEntity>,
  ) {}

  async create(data: CreateMenuItemData): Promise<DomainMenuItem> {
    const saved = await this.repository.save(
      this.repository.create({
        brandId: data.brandId,
        category: data.category,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl ?? null,
        isAvailable: data.isAvailable ?? true,
        sortOrder: data.sortOrder ?? 0,
        isPublished: data.isPublished ?? true,
      }),
    );
    return MenuItemMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainMenuItem | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? MenuItemMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListMenuItemsQuery,
  ): Promise<PaginatedResult<DomainMenuItem>> {
    const { page = 1, limit = 50, brandId } = query;
    const where: Record<string, unknown> = { deletedAt: IsNull() };
    if (brandId) where.brandId = brandId;
    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return {
      items: items.map((m) => MenuItemMapper.toDomain(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPublishedByBrandId(brandId: number): Promise<DomainMenuItem[]> {
    const items = await this.repository.find({
      where: { brandId, isPublished: true, deletedAt: IsNull() },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return items.map((m) => MenuItemMapper.toDomain(m));
  }

  async update(id: number, data: UpdateMenuItemData): Promise<DomainMenuItem> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.category !== undefined) entity.category = data.category;
    if (data.name !== undefined) entity.name = data.name;
    if (data.description !== undefined) entity.description = data.description;
    if (data.price !== undefined) entity.price = data.price;
    if (data.imageUrl !== undefined) entity.imageUrl = data.imageUrl;
    if (data.isAvailable !== undefined) entity.isAvailable = data.isAvailable;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    if (data.isPublished !== undefined) entity.isPublished = data.isPublished;
    const saved = await this.repository.save(entity);
    return MenuItemMapper.toDomain(saved);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    await this.repository.softRemove(entity);
  }
}
