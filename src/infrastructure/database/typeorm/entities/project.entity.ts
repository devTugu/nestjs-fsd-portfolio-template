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

@Entity({ name: 'projects' })
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('UQ_projects_slug', { unique: true })
  @Column({ length: 120 })
  slug: string;

  @Column({ type: 'json' })
  title: LocalizedText;

  @Column({ name: 'short_description', type: 'json' })
  shortDescription: LocalizedText;

  @Column({ type: 'json' })
  description: LocalizedText;

  @Column({
    name: 'thumbnail_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  thumbnailUrl: string | null;

  @Column({ type: 'json', nullable: true })
  images: { url: string; alt?: LocalizedText | string }[] | null;

  @Column({ name: 'tech_stack', type: 'json' })
  techStack: string[];

  @Column({ name: 'live_url', type: 'varchar', length: 500, nullable: true })
  liveUrl: string | null;

  @Column({ name: 'repo_url', type: 'varchar', length: 500, nullable: true })
  repoUrl: string | null;

  @Index('IDX_projects_featured_published')
  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Index('IDX_projects_published_sort')
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
