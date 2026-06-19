import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateNavigationNodeUseCase } from './create-navigation-node.use-case';
import { DeleteNavigationNodeUseCase } from './delete-navigation-node.use-case';
import { GetPublicNavigationTreeUseCase } from './get-public-navigation-tree.use-case';
import { ListNavigationNodesUseCase } from './list-navigation-nodes.use-case';
import { ReorderNavigationNodesUseCase } from './reorder-navigation-nodes.use-case';
import { UpdateNavigationNodeUseCase } from './update-navigation-node.use-case';
import { NavigationNode } from '@domain/navigation/entities/navigation-node.entity';
import { NavigationNodeType } from '@domain/navigation/entities/navigation-node-type';
import { NavigationScope } from '@domain/navigation/entities/navigation-scope';

function navNode(
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

describe('Navigation use cases', () => {
  const linkNode = navNode({
    id: 1,
    type: NavigationNodeType.LINK,
    labels: { en: 'Home', mn: 'Home' },
    href: '/',
  });

  const navigationNodes = {
    findById: jest.fn(),
    findAllByScope: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    reorder: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('ListNavigationNodesUseCase maps nodes', async () => {
    navigationNodes.findAllByScope.mockResolvedValue([linkNode]);
    const result = await new ListNavigationNodesUseCase(
      navigationNodes as never,
    ).execute(NavigationScope.HEADER);
    expect(result).toHaveLength(1);
    expect(result[0].href).toBe('/');
  });

  it('GetPublicNavigationTreeUseCase returns tree', async () => {
    navigationNodes.findAllByScope.mockResolvedValue([linkNode]);
    const result = await new GetPublicNavigationTreeUseCase(
      navigationNodes as never,
    ).execute(NavigationScope.HEADER);
    expect(result.tree).toHaveLength(1);
  });

  it('CreateNavigationNodeUseCase creates root link', async () => {
    navigationNodes.create.mockResolvedValue(linkNode);
    const result = await new CreateNavigationNodeUseCase(
      navigationNodes as never,
    ).execute({
      scope: NavigationScope.HEADER,
      parentId: null,
      type: NavigationNodeType.LINK,
      labels: { en: 'Home', mn: 'Home' },
      href: '/',
      sortOrder: 0,
      isPublished: true,
    });
    expect(result.id).toBe(1);
  });

  it('CreateNavigationNodeUseCase rejects missing parent', async () => {
    navigationNodes.findById.mockResolvedValue(null);
    await expect(
      new CreateNavigationNodeUseCase(navigationNodes as never).execute({
        scope: NavigationScope.HEADER,
        parentId: 99,
        type: NavigationNodeType.LINK,
        labels: { en: 'Child', mn: 'Child' },
        href: '/child',
        sortOrder: 0,
        isPublished: true,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('CreateNavigationNodeUseCase rejects parent scope mismatch', async () => {
    navigationNodes.findById.mockResolvedValue(
      navNode({
        id: 2,
        scope: NavigationScope.FOOTER,
        type: NavigationNodeType.GROUP,
        labels: { en: 'Group', mn: 'Group' },
      }),
    );
    await expect(
      new CreateNavigationNodeUseCase(navigationNodes as never).execute({
        scope: NavigationScope.HEADER,
        parentId: 2,
        type: NavigationNodeType.LINK,
        labels: { en: 'Child', mn: 'Child' },
        href: '/child',
        sortOrder: 0,
        isPublished: true,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('CreateNavigationNodeUseCase rejects link without href', async () => {
    await expect(
      new CreateNavigationNodeUseCase(navigationNodes as never).execute({
        scope: NavigationScope.HEADER,
        parentId: null,
        type: NavigationNodeType.LINK,
        labels: { en: 'Home', mn: 'Home' },
        href: null,
        sortOrder: 0,
        isPublished: true,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('UpdateNavigationNodeUseCase updates node', async () => {
    navigationNodes.findById.mockResolvedValue(linkNode);
    navigationNodes.update.mockResolvedValue({
      ...linkNode,
      labels: { en: 'Updated', mn: 'Updated' },
    });
    const result = await new UpdateNavigationNodeUseCase(
      navigationNodes as never,
    ).execute(1, { labels: { en: 'Updated', mn: 'Updated' } });
    expect(result.labels.en).toBe('Updated');
  });

  it('UpdateNavigationNodeUseCase throws NOT_FOUND', async () => {
    navigationNodes.findById.mockResolvedValue(null);
    await expect(
      new UpdateNavigationNodeUseCase(navigationNodes as never).execute(1, {}),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('UpdateNavigationNodeUseCase rejects self as parent', async () => {
    navigationNodes.findById.mockImplementation((id: number) =>
      Promise.resolve(id === 1 ? linkNode : null),
    );
    await expect(
      new UpdateNavigationNodeUseCase(navigationNodes as never).execute(1, {
        parentId: 1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('DeleteNavigationNodeUseCase soft deletes', async () => {
    navigationNodes.findById.mockResolvedValue(linkNode);
    await new DeleteNavigationNodeUseCase(navigationNodes as never).execute(1);
    expect(navigationNodes.softDelete).toHaveBeenCalledWith(1);
  });

  it('DeleteNavigationNodeUseCase throws NOT_FOUND', async () => {
    navigationNodes.findById.mockResolvedValue(null);
    await expect(
      new DeleteNavigationNodeUseCase(navigationNodes as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('CreateNavigationNodeUseCase creates child under group parent', async () => {
    const groupNode = navNode({
      id: 2,
      scope: NavigationScope.FOOTER,
      type: NavigationNodeType.GROUP,
      labels: { en: 'Group', mn: 'Group' },
      parentId: null,
    });
    const childNode = navNode({
      id: 3,
      scope: NavigationScope.FOOTER,
      type: NavigationNodeType.LINK,
      labels: { en: 'Child', mn: 'Child' },
      href: '/child',
      parentId: 2,
    });
    navigationNodes.findById.mockImplementation((id: number) => {
      if (id === 2) return Promise.resolve(groupNode);
      return Promise.resolve(null);
    });
    navigationNodes.create.mockResolvedValue(childNode);

    const result = await new CreateNavigationNodeUseCase(
      navigationNodes as never,
    ).execute({
      scope: NavigationScope.FOOTER,
      parentId: 2,
      type: NavigationNodeType.LINK,
      labels: { en: 'Child', mn: 'Child' },
      href: '/child',
      sortOrder: 0,
      isPublished: true,
    });

    expect(result.id).toBe(3);
  });

  it('UpdateNavigationNodeUseCase changes parent successfully', async () => {
    const footerLink = navNode({
      id: 1,
      scope: NavigationScope.FOOTER,
      type: NavigationNodeType.LINK,
      labels: { en: 'Link', mn: 'Link' },
      href: '/link',
      parentId: null,
    });
    const groupNode = navNode({
      id: 2,
      scope: NavigationScope.FOOTER,
      type: NavigationNodeType.GROUP,
      labels: { en: 'Group', mn: 'Group' },
      parentId: null,
    });
    navigationNodes.findById.mockImplementation((id: number) => {
      if (id === 1) return Promise.resolve(footerLink);
      if (id === 2) return Promise.resolve(groupNode);
      return Promise.resolve(null);
    });
    navigationNodes.update.mockResolvedValue({ ...footerLink, parentId: 2 });

    const result = await new UpdateNavigationNodeUseCase(
      navigationNodes as never,
    ).execute(1, { parentId: 2 });

    expect(result.parentId).toBe(2);
  });

  it('UpdateNavigationNodeUseCase rejects missing parent', async () => {
    navigationNodes.findById.mockImplementation((id: number) =>
      Promise.resolve(id === 1 ? linkNode : null),
    );
    await expect(
      new UpdateNavigationNodeUseCase(navigationNodes as never).execute(1, {
        parentId: 99,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('UpdateNavigationNodeUseCase rejects parent scope mismatch on change', async () => {
    const footerParent = navNode({
      id: 2,
      scope: NavigationScope.FOOTER,
      type: NavigationNodeType.GROUP,
      labels: { en: 'Footer', mn: 'Footer' },
    });
    navigationNodes.findById.mockImplementation((id: number) => {
      if (id === 1) return Promise.resolve(linkNode);
      if (id === 2) return Promise.resolve(footerParent);
      return Promise.resolve(null);
    });
    await expect(
      new UpdateNavigationNodeUseCase(navigationNodes as never).execute(1, {
        parentId: 2,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('ReorderNavigationNodesUseCase reorders nested tree with parent overrides', async () => {
    const groupNode = navNode({
      id: 2,
      scope: NavigationScope.FOOTER,
      type: NavigationNodeType.GROUP,
      labels: { en: 'Group', mn: 'Group' },
      parentId: null,
    });
    const childNode = navNode({
      id: 3,
      scope: NavigationScope.FOOTER,
      type: NavigationNodeType.LINK,
      labels: { en: 'Child', mn: 'Child' },
      href: '/child',
      parentId: 2,
    });
    navigationNodes.findAllByScope.mockResolvedValue([groupNode, childNode]);

    await new ReorderNavigationNodesUseCase(navigationNodes as never).execute(
      NavigationScope.FOOTER,
      [
        { id: 2, parentId: null, sortOrder: 0 },
        { id: 3, parentId: 2, sortOrder: 1 },
      ],
    );

    expect(navigationNodes.reorder).toHaveBeenCalledWith([
      { id: 2, parentId: null, sortOrder: 0 },
      { id: 3, parentId: 2, sortOrder: 1 },
    ]);
  });

  it('ReorderNavigationNodesUseCase no-ops on empty items', async () => {
    await new ReorderNavigationNodesUseCase(navigationNodes as never).execute(
      NavigationScope.HEADER,
      [],
    );
    expect(navigationNodes.reorder).not.toHaveBeenCalled();
  });

  it('ReorderNavigationNodesUseCase reorders valid items', async () => {
    navigationNodes.findAllByScope.mockResolvedValue([linkNode]);
    await new ReorderNavigationNodesUseCase(navigationNodes as never).execute(
      NavigationScope.HEADER,
      [{ id: 1, parentId: null, sortOrder: 0 }],
    );
    expect(navigationNodes.reorder).toHaveBeenCalled();
  });

  it('ReorderNavigationNodesUseCase rejects unknown node', async () => {
    navigationNodes.findAllByScope.mockResolvedValue([]);
    await expect(
      new ReorderNavigationNodesUseCase(navigationNodes as never).execute(
        NavigationScope.HEADER,
        [{ id: 1, parentId: null, sortOrder: 0 }],
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('ReorderNavigationNodesUseCase rejects unknown parent', async () => {
    navigationNodes.findAllByScope.mockResolvedValue([linkNode]);
    await expect(
      new ReorderNavigationNodesUseCase(navigationNodes as never).execute(
        NavigationScope.HEADER,
        [{ id: 1, parentId: 99, sortOrder: 0 }],
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
