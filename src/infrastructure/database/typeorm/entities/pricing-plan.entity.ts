import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type {
  LocalizedStringList,
  LocalizedText,
} from '@shared/domain/localized-content';

@Entity({ name: 'pricing_plans' })
export class PricingPlanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('UQ_pricing_plans_slug', { unique: true })
  @Column({ length: 120 })
  slug: string;

  @Column({ type: 'json' })
  name: LocalizedText;

  @Column({ type: 'json' })
  description: LocalizedText;

  @Column({ name: 'price_label', type: 'json' })
  priceLabel: LocalizedText;

  @Column({ name: 'price_note', type: 'json', nullable: true })
  priceNote: LocalizedText | null;

  @Column({ type: 'json' })
  features: LocalizedStringList;

  @Column({ name: 'cta_label', type: 'json' })
  ctaLabel: LocalizedText;

  @Column({ name: 'cta_url', length: 500 })
  ctaUrl: string;

  @Column({ name: 'is_highlighted', default: false })
  isHighlighted: boolean;

  @Index('IDX_pricing_plans_published_sort')
  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}
