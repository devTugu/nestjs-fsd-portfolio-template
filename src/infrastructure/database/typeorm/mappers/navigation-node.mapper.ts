import { NavigationNode as DomainNavigationNode } from '@domain/navigation/entities/navigation-node.entity';
import { NavigationNodeEntity } from '../entities/navigation-node.entity';

export class NavigationNodeMapper {
  static toDomain(entity: NavigationNodeEntity): DomainNavigationNode {
    return new DomainNavigationNode(
      entity.id,
      entity.scope,
      entity.parentId,
      entity.type,
      entity.labels,
      entity.descriptions,
      entity.href,
      entity.icon,
      entity.metadata,
      entity.sortOrder,
      entity.isPublished,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
