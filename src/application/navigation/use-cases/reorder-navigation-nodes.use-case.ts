import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  INavigationNodeRepository,
  ReorderNavigationNodeData,
} from '@domain/navigation/repositories/navigation-node.repository.interface';
import { NavigationScope } from '@domain/navigation/entities/navigation-scope';
import { NavigationTreeBuilderService } from '@domain/navigation/services/navigation-tree-builder.service';
import { NAVIGATION_NODE_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class ReorderNavigationNodesUseCase {
  private readonly treeBuilder = new NavigationTreeBuilderService();

  constructor(
    @Inject(NAVIGATION_NODE_REPOSITORY)
    private readonly navigationNodes: INavigationNodeRepository,
  ) {}

  async execute(
    scope: NavigationScope,
    items: ReorderNavigationNodeData[],
  ): Promise<void> {
    if (items.length === 0) return;

    const existing = await this.navigationNodes.findAllByScope(scope);
    const byId = new Map(existing.map((node) => [node.id, node]));

    for (const item of items) {
      const node = byId.get(item.id);
      if (!node) {
        throw new BadRequestException(`Navigation node ${item.id} not found`);
      }
      const parent = item.parentId ? byId.get(item.parentId) : null;
      if (item.parentId && !parent) {
        throw new BadRequestException(
          `Parent navigation node ${item.parentId} not found`,
        );
      }
      const depth = parent
        ? this.computeDepth(item.parentId, items, byId) + 1
        : 1;
      this.treeBuilder.validateParentChild(
        scope,
        parent ?? null,
        node.type,
        depth,
      );
    }

    await this.navigationNodes.reorder(items);
  }

  private computeDepth(
    parentId: number | null,
    items: ReorderNavigationNodeData[],
    byId: Map<number, { parentId: number | null }>,
  ): number {
    let depth = 0;
    let currentId: number | null = parentId;
    const parentOverrides = new Map(
      items.map((item) => [item.id, item.parentId]),
    );

    while (currentId !== null && depth < 10) {
      depth += 1;
      const node = byId.get(currentId);
      if (!node) break;
      currentId = parentOverrides.get(currentId) ?? node.parentId;
    }
    return depth;
  }
}
