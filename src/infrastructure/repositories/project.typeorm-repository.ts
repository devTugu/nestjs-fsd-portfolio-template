import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository } from 'typeorm';
import {
  CreateProjectData,
  IProjectRepository,
  ListProjectsQuery,
  UpdateProjectData,
} from '@domain/project/repositories/project.repository.interface';
import { Project as DomainProject } from '@domain/project/entities/project.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { ProjectEntity } from '../database/typeorm/entities/project.entity';
import { ProjectMapper } from '../database/typeorm/mappers/project.mapper';

@Injectable()
export class ProjectTypeOrmRepository implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repository: Repository<ProjectEntity>,
  ) {}

  async create(data: CreateProjectData): Promise<DomainProject> {
    const saved = await this.repository.save(
      this.repository.create({
        slug: data.slug,
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl ?? null,
        images: data.images ?? [],
        techStack: data.techStack,
        liveUrl: data.liveUrl ?? null,
        repoUrl: data.repoUrl ?? null,
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? false,
        sortOrder: data.sortOrder ?? 0,
        publishedAt: data.publishedAt ?? null,
      }),
    );
    return ProjectMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainProject | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? ProjectMapper.toDomain(entity) : null;
  }

  async findBySlug(slug: string): Promise<DomainProject | null> {
    const entity = await this.repository.findOne({
      where: { slug, deletedAt: IsNull() },
    });
    return entity ? ProjectMapper.toDomain(entity) : null;
  }

  async findPublishedBySlug(slug: string): Promise<DomainProject | null> {
    const entity = await this.repository.findOne({
      where: { slug, isPublished: true, deletedAt: IsNull() },
    });
    return entity ? ProjectMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListProjectsQuery,
  ): Promise<PaginatedResult<DomainProject>> {
    const { page = 1, limit = 20, search, featured, publishedOnly } = query;
    const where: Record<string, unknown> = { deletedAt: IsNull() };
    if (publishedOnly !== undefined) where.isPublished = publishedOnly;
    if (featured !== undefined) where.isFeatured = featured;
    if (search) {
      where.title = ILike(`%${search}%`);
    }
    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return {
      items: items.map((p) => ProjectMapper.toDomain(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllPublished(query: {
    featured?: boolean;
    limit?: number;
  }): Promise<DomainProject[]> {
    const where: Record<string, unknown> = {
      isPublished: true,
      deletedAt: IsNull(),
    };
    if (query.featured !== undefined) where.isFeatured = query.featured;
    const items = await this.repository.find({
      where,
      take: query.limit ?? 100,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return items.map((p) => ProjectMapper.toDomain(p));
  }

  async update(id: number, data: UpdateProjectData): Promise<DomainProject> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.slug !== undefined) entity.slug = data.slug;
    if (data.title !== undefined) entity.title = data.title;
    if (data.shortDescription !== undefined)
      entity.shortDescription = data.shortDescription;
    if (data.description !== undefined) entity.description = data.description;
    if (data.thumbnailUrl !== undefined)
      entity.thumbnailUrl = data.thumbnailUrl;
    if (data.images !== undefined) entity.images = data.images;
    if (data.techStack !== undefined) entity.techStack = data.techStack;
    if (data.liveUrl !== undefined) entity.liveUrl = data.liveUrl;
    if (data.repoUrl !== undefined) entity.repoUrl = data.repoUrl;
    if (data.isFeatured !== undefined) entity.isFeatured = data.isFeatured;
    if (data.isPublished !== undefined) entity.isPublished = data.isPublished;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    if (data.publishedAt !== undefined) entity.publishedAt = data.publishedAt;
    const saved = await this.repository.save(entity);
    return ProjectMapper.toDomain(saved);
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
