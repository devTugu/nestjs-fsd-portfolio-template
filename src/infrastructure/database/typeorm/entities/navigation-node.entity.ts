import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { LocalizedText } from '@domain/navigation/entities/localized-text';
import type { NavigationNodeMetadata } from '@domain/navigation/entities/navigation-node.entity';
import { NavigationNodeType } from '@domain/navigation/entities/navigation-node-type';
import { NavigationScope } from '@domain/navigation/entities/navigation-scope';

@Entity({ name: 'navigation_nodes' })
export class NavigationNodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('IDX_navigation_nodes_scope_parent_sort')
  @Column({ type: 'enum', enum: NavigationScope })
  scope: NavigationScope;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId: number | null;

  @Column({ type: 'enum', enum: NavigationNodeType })
  type: NavigationNodeType;

  @Column({ type: 'json' })
  labels: LocalizedText;

  @Column({ type: 'json', nullable: true })
  descriptions: LocalizedText | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  href: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  icon: string | null;

  @Column({ type: 'json', nullable: true })
  metadata: NavigationNodeMetadata | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Index('IDX_navigation_nodes_published')
  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
