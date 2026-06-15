import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository } from 'typeorm';
import {
  CreateExperienceData,
  IExperienceRepository,
  ListExperiencesQuery,
  UpdateExperienceData,
} from '@domain/experience/repositories/experience.repository.interface';
import { Experience as DomainExperience } from '@domain/experience/entities/experience.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { ExperienceEntity } from '../database/typeorm/entities/experience.entity';
import { ExperienceMapper } from '../database/typeorm/mappers/experience.mapper';

@Injectable()
export class ExperienceTypeOrmRepository implements IExperienceRepository {
  constructor(
    @InjectRepository(ExperienceEntity)
    private readonly repository: Repository<ExperienceEntity>,
  ) {}

  async create(data: CreateExperienceData): Promise<DomainExperience> {
    const saved = await this.repository.save(
      this.repository.create({
        company: data.company,
        role: data.role,
        location: data.location ?? null,
        description: data.description ?? null,
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        isCurrent: data.isCurrent ?? false,
        isPublished: data.isPublished ?? true,
        sortOrder: data.sortOrder ?? 0,
      }),
    );
    return ExperienceMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainExperience | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? ExperienceMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListExperiencesQuery,
  ): Promise<PaginatedResult<DomainExperience>> {
    const { page = 1, limit = 20, search } = query;
    const where: Record<string, unknown> = { deletedAt: IsNull() };
    if (search) where.company = ILike(`%${search}%`);
    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { sortOrder: 'ASC', startDate: 'DESC' },
    });
    return {
      items: items.map((e) => ExperienceMapper.toDomain(e)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllPublished(): Promise<DomainExperience[]> {
    const items = await this.repository.find({
      where: { isPublished: true, deletedAt: IsNull() },
      order: { sortOrder: 'ASC', startDate: 'DESC' },
    });
    return items.map((e) => ExperienceMapper.toDomain(e));
  }

  async update(
    id: number,
    data: UpdateExperienceData,
  ): Promise<DomainExperience> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.company !== undefined) entity.company = data.company;
    if (data.role !== undefined) entity.role = data.role;
    if (data.location !== undefined) entity.location = data.location;
    if (data.description !== undefined) entity.description = data.description;
    if (data.startDate !== undefined) entity.startDate = data.startDate;
    if (data.endDate !== undefined) entity.endDate = data.endDate;
    if (data.isCurrent !== undefined) entity.isCurrent = data.isCurrent;
    if (data.isPublished !== undefined) entity.isPublished = data.isPublished;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    const saved = await this.repository.save(entity);
    return ExperienceMapper.toDomain(saved);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.repository.findOneOrFail({ where: { id } });
    await this.repository.softRemove(entity);
  }
}
