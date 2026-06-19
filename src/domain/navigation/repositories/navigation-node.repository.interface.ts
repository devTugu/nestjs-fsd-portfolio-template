import {
  NavigationNode,
  NavigationNodeMetadata,
} from '../entities/navigation-node.entity';
import { NavigationNodeType } from '../entities/navigation-node-type';
import { NavigationScope } from '../entities/navigation-scope';
import type { LocalizedText } from '../entities/localized-text';

export const NAVIGATION_NODE_REPOSITORY = Symbol('NAVIGATION_NODE_REPOSITORY');

export interface CreateNavigationNodeData {
  scope: NavigationScope;
  parentId?: number | null;
  type: NavigationNodeType;
  labels: LocalizedText;
  descriptions?: LocalizedText | null;
  href?: string | null;
  icon?: string | null;
  metadata?: NavigationNodeMetadata | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface UpdateNavigationNodeData {
  parentId?: number | null;
  type?: NavigationNodeType;
  labels?: LocalizedText;
  descriptions?: LocalizedText | null;
  href?: string | null;
  icon?: string | null;
  metadata?: NavigationNodeMetadata | null;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface ReorderNavigationNodeData {
  id: number;
  parentId: number | null;
  sortOrder: number;
}

export interface INavigationNodeRepository {
  create(data: CreateNavigationNodeData): Promise<NavigationNode>;
  findById(id: number): Promise<NavigationNode | null>;
  findAllByScope(
    scope: NavigationScope,
    options?: { publishedOnly?: boolean },
  ): Promise<NavigationNode[]>;
  update(id: number, data: UpdateNavigationNodeData): Promise<NavigationNode>;
  softDelete(id: number): Promise<void>;
  reorder(items: ReorderNavigationNodeData[]): Promise<void>;
}
