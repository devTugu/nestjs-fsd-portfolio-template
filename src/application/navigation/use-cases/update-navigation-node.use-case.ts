import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  INavigationNodeRepository,
  UpdateNavigationNodeData,
} from '@domain/navigation/repositories/navigation-node.repository.interface';
import { NavigationTreeBuilderService } from '@domain/navigation/services/navigation-tree-builder.service';
import { NavigationNodeType } from '@domain/navigation/entities/navigation-node-type';
import { NavigationScope } from '@domain/navigation/entities/navigation-scope';
import { NAVIGATION_NODE_REPOSITORY } from '@shared/constants/tokens';
import { AppErrors } from '@application/exceptions/application.exception';
import {
  NavigationNodeOutput,
  toNavigationNodeOutput,
} from '../dto/navigation-output.mapper';
import { assertValidNavigationHref } from '../utils/navigation-href.validator';

@Injectable()
export class UpdateNavigationNodeUseCase {
  private readonly treeBuilder = new NavigationTreeBuilderService();

  constructor(
    @Inject(NAVIGATION_NODE_REPOSITORY)
    private readonly navigationNodes: INavigationNodeRepository,
  ) {}

  async execute(
    id: number,
    input: UpdateNavigationNodeData,
  ): Promise<NavigationNodeOutput> {
    const existing = await this.navigationNodes.findById(id);
    if (!existing) {
      throw AppErrors.NOT_FOUND('Navigation node not found.');
    }

    const nextType = input.type ?? existing.type;
    const nextHref = input.href !== undefined ? input.href : existing.href;
    assertValidNavigationHref(nextType, nextHref);

    if (input.parentId !== undefined) {
      await this.validateParentChange(existing, input.parentId, nextType);
    }

    const updated = await this.navigationNodes.update(id, input);
    return toNavigationNodeOutput(updated);
  }

  private async validateParentChange(
    existing: { id: number; scope: NavigationScope; parentId: number | null },
    parentId: number | null,
    childType: NavigationNodeType,
  ): Promise<void> {
    if (parentId === existing.id) {
      throw new BadRequestException('Node cannot be its own parent');
    }
    const parent = parentId
      ? await this.navigationNodes.findById(parentId)
      : null;
    if (parentId && !parent) {
      throw new NotFoundException('Parent navigation node not found');
    }
    if (parent && parent.scope !== existing.scope) {
      throw new BadRequestException('Parent scope mismatch');
    }
    const depth = parent ? (await this.resolveDepth(parent.id)) + 1 : 1;
    this.treeBuilder.validateParentChild(
      existing.scope,
      parent,
      childType,
      depth,
    );
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
