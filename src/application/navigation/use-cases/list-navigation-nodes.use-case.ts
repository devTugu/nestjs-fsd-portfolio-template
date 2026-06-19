import { Inject, Injectable } from '@nestjs/common';
import { INavigationNodeRepository } from '@domain/navigation/repositories/navigation-node.repository.interface';
import { NavigationScope } from '@domain/navigation/entities/navigation-scope';
import { NAVIGATION_NODE_REPOSITORY } from '@shared/constants/tokens';
import {
  NavigationNodeOutput,
  toNavigationNodeOutput,
} from '../dto/navigation-output.mapper';

@Injectable()
export class ListNavigationNodesUseCase {
  constructor(
    @Inject(NAVIGATION_NODE_REPOSITORY)
    private readonly navigationNodes: INavigationNodeRepository,
  ) {}

  async execute(scope: NavigationScope): Promise<NavigationNodeOutput[]> {
    const nodes = await this.navigationNodes.findAllByScope(scope);
    return nodes.map(toNavigationNodeOutput);
  }
}
