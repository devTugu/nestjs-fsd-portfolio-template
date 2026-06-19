import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateNavigationNodeData,
  INavigationNodeRepository,
} from '@domain/navigation/repositories/navigation-node.repository.interface';
import { NavigationTreeBuilderService } from '@domain/navigation/services/navigation-tree-builder.service';
import { NAVIGATION_NODE_REPOSITORY } from '@shared/constants/tokens';
import {
  NavigationNodeOutput,
  toNavigationNodeOutput,
} from '../dto/navigation-output.mapper';
import { assertValidNavigationHref } from '../utils/navigation-href.validator';

@Injectable()
export class CreateNavigationNodeUseCase {
  private readonly treeBuilder = new NavigationTreeBuilderService();

  constructor(
    @Inject(NAVIGATION_NODE_REPOSITORY)
    private readonly navigationNodes: INavigationNodeRepository,
  ) {}

  async execute(
    input: CreateNavigationNodeData,
  ): Promise<NavigationNodeOutput> {
    assertValidNavigationHref(input.type, input.href ?? null);
    const parent = input.parentId
      ? await this.navigationNodes.findById(input.parentId)
      : null;

    if (input.parentId && !parent) {
      throw new BadRequestException('Parent navigation node not found');
    }
    if (parent && parent.scope !== input.scope) {
      throw new BadRequestException('Parent scope mismatch');
    }

    const depth = parent ? (await this.resolveDepth(parent.id)) + 1 : 1;
    this.treeBuilder.validateParentChild(
      input.scope,
      parent,
      input.type,
      depth,
    );

    const node = await this.navigationNodes.create(input);
    return toNavigationNodeOutput(node);
  }

  private async resolveDepth(nodeId: number): Promise<number> {
    let depth = 0;
    let currentId: number | null = nodeId;
    while (currentId !== null && depth < 10) {
      depth += 1;
      const node = await this.navigationNodes.findById(currentId);
      if (!node) break;
      currentId = node.parentId;
    }
    return depth;
  }
}
