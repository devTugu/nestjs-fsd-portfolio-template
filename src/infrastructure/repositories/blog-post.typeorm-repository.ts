import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  CreateBlogPostData,
  IBlogPostRepository,
  ListBlogPostsQuery,
  UpdateBlogPostData,
} from '@domain/blog/repositories/blog-post.repository.interface';
import { BlogPost as DomainBlogPost } from '@domain/blog/entities/blog-post.entity';
import { PaginatedResult } from '@shared/types/pagination';
import { BlogPostEntity } from '../database/typeorm/entities/blog-post.entity';
import { BlogPostMapper } from '../database/typeorm/mappers/blog-post.mapper';

@Injectable()
export class BlogPostTypeOrmRepository implements IBlogPostRepository {
  constructor(
    @InjectRepository(BlogPostEntity)
    private readonly repository: Repository<BlogPostEntity>,
  ) {}

  async create(data: CreateBlogPostData): Promise<DomainBlogPost> {
    const saved = await this.repository.save(
      this.repository.create({
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        authorName: data.authorName,
        authorRole: data.authorRole,
        coverImageUrl: data.coverImageUrl ?? null,
        isPublished: data.isPublished ?? false,
        sortOrder: data.sortOrder ?? 0,
        publishedAt: data.publishedAt ?? null,
      }),
    );
    return BlogPostMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainBlogPost | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? BlogPostMapper.toDomain(entity) : null;
  }

  async findBySlug(slug: string): Promise<DomainBlogPost | null> {
    const entity = await this.repository.findOne({
      where: { slug, deletedAt: IsNull() },
    });
    return entity ? BlogPostMapper.toDomain(entity) : null;
  }

  async findPublishedBySlug(slug: string): Promise<DomainBlogPost | null> {
    const entity = await this.repository.findOne({
      where: { slug, isPublished: true, deletedAt: IsNull() },
    });
    return entity ? BlogPostMapper.toDomain(entity) : null;
  }

  async findAll(
    query: ListBlogPostsQuery,
  ): Promise<PaginatedResult<DomainBlogPost>> {
    const { page = 1, limit = 20, category, publishedOnly } = query;
    const where: Record<string, unknown> = { deletedAt: IsNull() };
    if (publishedOnly !== undefined) where.isPublished = publishedOnly;
    if (category !== undefined) where.category = category;
    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { sortOrder: 'ASC', publishedAt: 'DESC', createdAt: 'DESC' },
    });
    return {
      items: items.map((p) => BlogPostMapper.toDomain(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: number, data: UpdateBlogPostData): Promise<DomainBlogPost> {
    const entity = await this.repository.findOneOrFail({
      where: { id, deletedAt: IsNull() },
    });
    if (data.slug !== undefined) entity.slug = data.slug;
    if (data.title !== undefined) entity.title = data.title;
    if (data.excerpt !== undefined) entity.excerpt = data.excerpt;
    if (data.content !== undefined) entity.content = data.content;
    if (data.category !== undefined) entity.category = data.category;
    if (data.authorName !== undefined) entity.authorName = data.authorName;
    if (data.authorRole !== undefined) entity.authorRole = data.authorRole;
    if (data.coverImageUrl !== undefined)
      entity.coverImageUrl = data.coverImageUrl;
    if (data.isPublished !== undefined) entity.isPublished = data.isPublished;
    if (data.sortOrder !== undefined) entity.sortOrder = data.sortOrder;
    if (data.publishedAt !== undefined) entity.publishedAt = data.publishedAt;
    const saved = await this.repository.save(entity);
    return BlogPostMapper.toDomain(saved);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.repository.findOneOrFail({ where: { id } });
    await this.repository.softRemove(entity);
  }

  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const qb = this.repository
      .createQueryBuilder('b')
      .where('b.slug = :slug', { slug })
      .withDeleted();
    if (excludeId !== undefined) {
      qb.andWhere('b.id != :excludeId', { excludeId });
    }
    const count = await qb.getCount();
    return count > 0;
  }
}
