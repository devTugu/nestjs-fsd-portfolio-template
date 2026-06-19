import {
  NavigationNode,
  NavigationNodeTree,
} from '@domain/navigation/entities/navigation-node.entity';
import { NavigationNodeType } from '@domain/navigation/entities/navigation-node-type';

export interface NavigationNodeOutput {
  id: number;
  scope: NavigationNode['scope'];
  parentId: number | null;
  type: NavigationNodeType;
  labels: NavigationNode['labels'];
  descriptions: NavigationNode['descriptions'];
  href: string | null;
  icon: string | null;
  metadata: NavigationNode['metadata'];
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicNavigationOutput {
  tree: NavigationNodeTree[];
}

export function toNavigationNodeOutput(
  node: NavigationNode,
): NavigationNodeOutput {
  return {
    id: node.id,
    scope: node.scope,
    parentId: node.parentId,
    type: node.type,
    labels: node.labels,
    descriptions: node.descriptions,
    href: node.href,
    icon: node.icon,
    metadata: node.metadata,
    sortOrder: node.sortOrder,
    isPublished: node.isPublished,
    createdAt: node.createdAt.toISOString(),
    updatedAt: node.updatedAt.toISOString(),
  };
}
