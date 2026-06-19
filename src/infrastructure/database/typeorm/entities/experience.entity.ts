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

@Entity({ name: 'experiences' })
export class ExperienceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  company: string;

  @Column({ type: 'json' })
  role: LocalizedText;

  @Column({ type: 'json', nullable: true })
  location: LocalizedText | null;

  @Column({ type: 'json', nullable: true })
  description: LocalizedText | null;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ name: 'is_current', default: false })
  isCurrent: boolean;

  @Index('IDX_experiences_published_sort')
  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}
