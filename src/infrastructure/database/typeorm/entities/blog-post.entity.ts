import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { LocalizedText } from '@shared/domain/localized-content';
import { BlogPostCategory } from '@domain/blog/entities/blog-post-category';

@Entity({ name: 'blog_posts' })
export class BlogPostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('UQ_blog_posts_slug', { unique: true })
  @Column({ length: 120 })
  slug: string;

  @Column({ type: 'json' })
  title: LocalizedText;

  @Column({ type: 'json' })
  excerpt: LocalizedText;

  @Column({ type: 'json' })
  content: LocalizedText;

  @Index('IDX_blog_posts_category_published')
  @Column({
    type: 'enum',
    enum: ['PRODUCT', 'ENGINEERING', 'CORPORATE', 'INDUSTRY'],
  })
  category: BlogPostCategory;

  @Column({ name: 'author_name', type: 'json' })
  authorName: LocalizedText;

  @Column({ name: 'author_role', type: 'json' })
  authorRole: LocalizedText;

  @Column({
    name: 'cover_image_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  coverImageUrl: string | null;

  @Index('IDX_blog_posts_published_sort')
  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}
