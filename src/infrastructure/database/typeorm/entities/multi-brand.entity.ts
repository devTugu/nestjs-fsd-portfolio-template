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
import type { SocialLink } from '@domain/site-setting/entities/site-settings.entity';
import { BrandType } from '@domain/brand/entities/brand-type';

@Entity({ name: 'brands' })
export class BrandEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('UQ_brands_slug', { unique: true })
  @Column({ length: 120 })
  slug: string;

  @Index('IDX_brands_type_published')
  @Column({ type: 'enum', enum: BrandType })
  type: BrandType;

  @Column({ type: 'json' })
  name: LocalizedText;

  @Column({ type: 'json' })
  description: LocalizedText;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({
    name: 'cover_image_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  coverImageUrl: string | null;

  @Column({ type: 'json', nullable: true })
  address: LocalizedText | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @Column({ name: 'map_embed', type: 'text', nullable: true })
  mapEmbed: string | null;

  @Column({ name: 'social_links', type: 'json', default: () => "'[]'" })
  socialLinks: SocialLink[];

  @Column({ name: 'work_hours', type: 'json', nullable: true })
  workHours: LocalizedText | null;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}

@Entity({ name: 'menu_items' })
export class MenuItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('IDX_menu_items_brand')
  @Column({ name: 'brand_id' })
  brandId: number;

  @Column({ type: 'json' })
  category: LocalizedText;

  @Column({ type: 'json' })
  name: LocalizedText;

  @Column({ type: 'json' })
  description: LocalizedText;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}

@Entity({ name: 'brand_events' })
export class BrandEventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('IDX_brand_events_brand')
  @Column({ name: 'brand_id' })
  brandId: number;

  @Column({ type: 'json' })
  title: LocalizedText;

  @Column({ type: 'json' })
  description: LocalizedText;

  @Column({ name: 'event_date', type: 'datetime' })
  eventDate: Date;

  @Column({ type: 'json' })
  location: LocalizedText;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}

@Entity({ name: 'history_entries' })
export class HistoryEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'json' })
  title: LocalizedText;

  @Column({ type: 'json' })
  description: LocalizedText;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}

@Entity({ name: 'leadership_members' })
export class LeadershipMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'json' })
  title: LocalizedText;

  @Column({ type: 'json' })
  quote: LocalizedText;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'social_links', type: 'json', default: () => "'[]'" })
  socialLinks: SocialLink[];

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}

@Entity({ name: 'team_members' })
export class TeamMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'json' })
  role: LocalizedText;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'social_links', type: 'json', default: () => "'[]'" })
  socialLinks: SocialLink[];

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}
