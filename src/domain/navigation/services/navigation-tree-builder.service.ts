import {
  NavigationNode,
  NavigationNodeTree,
} from '../entities/navigation-node.entity';
import { NavigationNodeType } from '../entities/navigation-node-type';
import { NavigationScope } from '../entities/navigation-scope';

const MAX_DEPTH: Record<NavigationScope, number> = {
  [NavigationScope.HEADER]: 4,
  [NavigationScope.FOOTER]: 2,
};

export class NavigationTreeBuilderService {
  buildTree(
    nodes: NavigationNode[],
    options: { publishedOnly: boolean },
  ): NavigationNodeTree[] {
    const filtered = options.publishedOnly
      ? nodes.filter((node) => node.isPublished)
      : nodes;

    const roots = filtered
      .filter((node) => node.parentId === null)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return roots
      .map((root) => this.buildSubtree(root, filtered, 1))
      .filter((node): node is NavigationNodeTree => node !== null);
  }

  validateParentChild(
    scope: NavigationScope,
    parent: NavigationNode | null,
    childType: NavigationNodeType,
    depth: number,
  ): void {
    if (depth > MAX_DEPTH[scope]) {
      throw new Error(`Maximum navigation depth exceeded for ${scope}`);
    }

    if (parent === null) {
      this.validateRootType(scope, childType);
      return;
    }

    this.validateNestedType(scope, parent.type, childType);
  }

  private buildSubtree(
    node: NavigationNode,
    all: NavigationNode[],
    depth: number,
  ): NavigationNodeTree | null {
    const children = all
      .filter((item) => item.parentId === node.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((child) => this.buildSubtree(child, all, depth + 1))
      .filter((child): child is NavigationNodeTree => child !== null);

    if (this.shouldPrune(node, children)) {
      return null;
    }

    return {
      id: node.id,
      scope: node.scope,
      type: node.type,
      labels: node.labels,
      descriptions: node.descriptions,
      href: node.href,
      icon: node.icon,
      metadata: node.metadata,
      sortOrder: node.sortOrder,
      children,
    };
  }

  private shouldPrune(
    node: NavigationNode,
    children: NavigationNodeTree[],
  ): boolean {
    if (node.type === NavigationNodeType.LINK) {
      return false;
    }
    if (node.type === NavigationNodeType.PROMO) {
      return false;
    }
    if (node.type === NavigationNodeType.CTA_ROW) {
      return false;
    }
    return children.length === 0;
  }

  private validateRootType(
    scope: NavigationScope,
    type: NavigationNodeType,
  ): void {
    const allowed =
      scope === NavigationScope.HEADER
        ? [NavigationNodeType.MEGA, NavigationNodeType.LINK]
        : [NavigationNodeType.GROUP];

    if (!allowed.includes(type)) {
      throw new Error(`Invalid root node type ${type} for ${scope}`);
    }
  }

  private validateNestedType(
    scope: NavigationScope,
    parentType: NavigationNodeType,
    childType: NavigationNodeType,
  ): void {
    const headerRules: Partial<
      Record<NavigationNodeType, NavigationNodeType[]>
    > = {
      [NavigationNodeType.MEGA]: [
        NavigationNodeType.COLUMN,
        NavigationNodeType.LINK,
        NavigationNodeType.SIDEBAR,
        NavigationNodeType.CTA_ROW,
      ],
      [NavigationNodeType.COLUMN]: [NavigationNodeType.LINK],
      [NavigationNodeType.SIDEBAR]: [
        NavigationNodeType.LINK,
        NavigationNodeType.PROMO,
      ],
    };

    const footerRules: Partial<
      Record<NavigationNodeType, NavigationNodeType[]>
    > = {
      [NavigationNodeType.GROUP]: [NavigationNodeType.LINK],
    };

    const rules = scope === NavigationScope.HEADER ? headerRules : footerRules;
    const allowed = rules[parentType];

    if (!allowed?.includes(childType)) {
      throw new Error(
        `Invalid child type ${childType} under parent ${parentType}`,
      );
    }
  }
}
