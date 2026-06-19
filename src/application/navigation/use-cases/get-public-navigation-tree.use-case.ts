import { Inject, Injectable } from '@nestjs/common';
import { INavigationNodeRepository } from '@domain/navigation/repositories/navigation-node.repository.interface';
import { NavigationScope } from '@domain/navigation/entities/navigation-scope';
import { NavigationTreeBuilderService } from '@domain/navigation/services/navigation-tree-builder.service';
import { NAVIGATION_NODE_REPOSITORY } from '@shared/constants/tokens';
import { PublicNavigationOutput } from '../dto/navigation-output.mapper';

@Injectable()
export class GetPublicNavigationTreeUseCase {
  private readonly treeBuilder = new NavigationTreeBuilderService();

  constructor(
    @Inject(NAVIGATION_NODE_REPOSITORY)
    private readonly navigationNodes: INavigationNodeRepository,
  ) {}

  async execute(scope: NavigationScope): Promise<PublicNavigationOutput> {
    const nodes = await this.navigationNodes.findAllByScope(scope, {
      publishedOnly: true,
    });
    return {
      tree: this.treeBuilder.buildTree(nodes, { publishedOnly: true }),
    };
  }
}
