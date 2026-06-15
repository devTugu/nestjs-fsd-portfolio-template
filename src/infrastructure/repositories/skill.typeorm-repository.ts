import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository } from 'typeorm';
import {
  CreateSkillData,
  ISkillRepository,
  ListSkillsQuery,
  UpdateSkillData,
} from '@domain/skill/repositories/skill.repository.interface';
import { Skill as DomainSkill } from '@domain/skill/entities/skill.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { SkillEntity } from '../database/typeorm/entities/skill.entity';
import { SkillMapper } from '../database/typeorm/mappers/skill.mapper';

@Injectable()
export class SkillTypeOrmRepository implements ISkillRepository {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly repository: Repository<SkillEntity>,
  ) {}

  async create(data: CreateSkillData): Promise<DomainSkill> {
    const saved = await this.repository.save(
      this.repository.create({
        name: data.name,
        category: data.category,
        proficiency: data.proficiency,
        icon: data.icon ?? null,
        isPublished: data.isPublished ?? true,
        sortOrder: data.sortOrder ?? 0,
      }),
    );
    return SkillMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainSkill | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? SkillMapper.toDomain(entity) : null;
  }

  async findAll(query: ListSkillsQuery): Promise<PaginatedResult<DomainSkill>> {
    const { page = 1, limit = 20, search, category } = query;
    const where: Record<string, unknown> = { deletedAt: IsNull() };
    if (category) where.category = category;
    if (search) where.name = ILike(`%${search}%`);
    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
    return {
      items: items.map((s) => SkillMapper.toDomain(s)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllPublished(category?: string): Promise<DomainSkill[]> {
    const where: Record<string, unknown> = {
      isPublished: true,
      deletedAt: IsNull(),
    };
    if (category) where.category = category;
    const items = await this.repository.find({
      where,
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
    return items.map((s) => SkillMapper.toDomain(s));
  }

  async update(id: number, data: UpdateSkillData): Promise<DomainSkill> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.name !== undefined) entity.name = data.name;
    if (data.category !== undefined) entity.category = data.category;
    if (data.proficiency !== undefined) entity.proficiency = data.proficiency;
    if (data.icon !== undefined) entity.icon = data.icon;
    if (data.isPublished !== undefined) entity.isPublished = data.isPublished;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    const saved = await this.repository.save(entity);
    return SkillMapper.toDomain(saved);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.repository.findOneOrFail({ where: { id } });
    await this.repository.softRemove(entity);
  }

  async nameCategoryExists(
    name: string,
    category: string,
    excludeId?: number,
  ): Promise<boolean> {
    const qb = this.repository
      .createQueryBuilder('s')
      .where('s.name = :name AND s.category = :category', { name, category })
      .withDeleted();
    if (excludeId !== undefined) {
      qb.andWhere('s.id != :excludeId', { excludeId });
    }
    return (await qb.getCount()) > 0;
  }
}
