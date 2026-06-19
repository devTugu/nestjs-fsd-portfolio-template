import { NavigationNodeType } from './navigation-node-type';
import { NavigationScope } from './navigation-scope';
import type { LocalizedText } from './localized-text';

export interface NavigationNodeMetadata {
  imageUrl?: string;
  ctaHref?: string;
  ctaLabel?: LocalizedText;
  badge?: string;
}

export class NavigationNode {
  constructor(
    public readonly id: number,
    public readonly scope: NavigationScope,
    public readonly parentId: number | null,
    public readonly type: NavigationNodeType,
    public readonly labels: LocalizedText,
    public readonly descriptions: LocalizedText | null,
    public readonly href: string | null,
    public readonly icon: string | null,
    public readonly metadata: NavigationNodeMetadata | null,
    public readonly sortOrder: number,
    public readonly isPublished: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export interface NavigationNodeTree {
  id: number;
  scope: NavigationScope;
  type: NavigationNodeType;
  labels: LocalizedText;
  descriptions: LocalizedText | null;
  href: string | null;
  icon: string | null;
  metadata: NavigationNodeMetadata | null;
  sortOrder: number;
  children: NavigationNodeTree[];
}
