import { NavigationScope } from '../entities/navigation-scope';
import { NavigationNodeType } from '../entities/navigation-node-type';
import { NavigationTreeBuilderService } from '../services/navigation-tree-builder.service';
import { NavigationNode } from '../entities/navigation-node.entity';

function node(
  partial: Partial<NavigationNode> &
    Pick<NavigationNode, 'id' | 'type' | 'labels'>,
): NavigationNode {
  return new NavigationNode(
    partial.id,
    partial.scope ?? NavigationScope.HEADER,
    partial.parentId ?? null,
    partial.type,
    partial.labels,
    partial.descriptions ?? null,
    partial.href ?? null,
    partial.icon ?? null,
    partial.metadata ?? null,
    partial.sortOrder ?? 0,
    partial.isPublished ?? true,
    partial.createdAt ?? new Date(),
    partial.updatedAt ?? new Date(),
  );
}

describe('NavigationTreeBuilderService', () => {
  const builder = new NavigationTreeBuilderService();

  it('builds published tree and prunes empty mega nodes', () => {
    const nodes = [
      node({
        id: 1,
        type: NavigationNodeType.MEGA,
        labels: { en: 'Products', mn: 'P' },
        sortOrder: 0,
      }),
      node({
        id: 2,
        parentId: 1,
        type: NavigationNodeType.LINK,
        labels: { en: 'Payments', mn: 'Pay' },
        href: '/',
        sortOrder: 0,
      }),
      node({
        id: 3,
        type: NavigationNodeType.MEGA,
        labels: { en: 'Empty', mn: 'E' },
        sortOrder: 1,
        isPublished: false,
      }),
    ];

    const tree = builder.buildTree(nodes, { publishedOnly: true });
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].href).toBe('/');
  });

  it('rejects invalid child type under footer group', () => {
    const parent = node({
      id: 10,
      scope: NavigationScope.FOOTER,
      type: NavigationNodeType.GROUP,
      labels: { en: 'Group', mn: 'G' },
    });

    expect(() =>
      builder.validateParentChild(
        NavigationScope.FOOTER,
        parent,
        NavigationNodeType.COLUMN,
        2,
      ),
    ).toThrow(/Invalid child type/);
  });

  it('allows mega column link nesting', () => {
    const mega = node({
      id: 1,
      type: NavigationNodeType.MEGA,
      labels: { en: 'Products', mn: 'P' },
    });

    expect(() =>
      builder.validateParentChild(
        NavigationScope.HEADER,
        mega,
        NavigationNodeType.COLUMN,
        2,
      ),
    ).not.toThrow();
  });

  it('rejects invalid root type for header', () => {
    expect(() =>
      builder.validateParentChild(
        NavigationScope.HEADER,
        null,
        NavigationNodeType.GROUP,
        1,
      ),
    ).toThrow(/Invalid root node type/);
  });

  it('rejects invalid root type for footer', () => {
    expect(() =>
      builder.validateParentChild(
        NavigationScope.FOOTER,
        null,
        NavigationNodeType.LINK,
        1,
      ),
    ).toThrow(/Invalid root node type/);
  });

  it('rejects invalid nested child under header mega', () => {
    const mega = node({
      id: 1,
      type: NavigationNodeType.MEGA,
      labels: { en: 'Products', mn: 'P' },
    });

    expect(() =>
      builder.validateParentChild(
        NavigationScope.HEADER,
        mega,
        NavigationNodeType.GROUP,
        2,
      ),
    ).toThrow(/Invalid child type/);
  });

  it('rejects max depth exceeded for header', () => {
    expect(() =>
      builder.validateParentChild(
        NavigationScope.HEADER,
        null,
        NavigationNodeType.LINK,
        5,
      ),
    ).toThrow(/Maximum navigation depth exceeded/);
  });
});
