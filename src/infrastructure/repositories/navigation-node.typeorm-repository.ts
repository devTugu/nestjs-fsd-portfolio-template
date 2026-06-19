import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import {
  CreateNavigationNodeData,
  INavigationNodeRepository,
  ReorderNavigationNodeData,
  UpdateNavigationNodeData,
} from '@domain/navigation/repositories/navigation-node.repository.interface';
import { NavigationNode as DomainNavigationNode } from '@domain/navigation/entities/navigation-node.entity';
import { NavigationScope } from '@domain/navigation/entities/navigation-scope';
import { NavigationNodeEntity } from '../database/typeorm/entities/navigation-node.entity';
import { NavigationNodeMapper } from '../database/typeorm/mappers/navigation-node.mapper';

@Injectable()
export class NavigationNodeTypeOrmRepository implements INavigationNodeRepository {
  constructor(
    @InjectRepository(NavigationNodeEntity)
    private readonly repository: Repository<NavigationNodeEntity>,
  ) {}

  async create(data: CreateNavigationNodeData): Promise<DomainNavigationNode> {
    const saved = await this.repository.save(
      this.repository.create({
        scope: data.scope,
        parentId: data.parentId ?? null,
        type: data.type,
        labels: data.labels,
        descriptions: data.descriptions ?? null,
        href: data.href ?? null,
        icon: data.icon ?? null,
        metadata: data.metadata ?? null,
        sortOrder: data.sortOrder ?? 0,
        isPublished: data.isPublished ?? false,
      }),
    );
    return NavigationNodeMapper.toDomain(saved);
  }

  async findById(id: number): Promise<DomainNavigationNode | null> {
    const entity = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    return entity ? NavigationNodeMapper.toDomain(entity) : null;
  }

  async findAllByScope(
    scope: NavigationScope,
    options?: { publishedOnly?: boolean },
  ): Promise<DomainNavigationNode[]> {
    const where: Record<string, unknown> = {
      scope,
      deletedAt: IsNull(),
    };
    if (options?.publishedOnly) {
      where.isPublished = true;
    }
    const items = await this.repository.find({
      where,
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return items.map((item) => NavigationNodeMapper.toDomain(item));
  }

  async update(
    id: number,
    data: UpdateNavigationNodeData,
  ): Promise<DomainNavigationNode> {
    await this.repository.update(id, data);
    const updated = await this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!updated) {
      throw new Error(`Navigation node ${id} not found`);
    }
    return NavigationNodeMapper.toDomain(updated);
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async reorder(items: ReorderNavigationNodeData[]): Promise<void> {
    if (items.length === 0) return;
    const ids = items.map((item) => item.id);
    const entities = await this.repository.find({
      where: { id: In(ids), deletedAt: IsNull() },
    });
    const byId = new Map(entities.map((entity) => [entity.id, entity]));
    for (const item of items) {
      const entity = byId.get(item.id);
      if (!entity) continue;
      entity.parentId = item.parentId;
      entity.sortOrder = item.sortOrder;
    }
    await this.repository.save(Array.from(byId.values()));
  }
}
