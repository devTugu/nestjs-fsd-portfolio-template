import { Module } from '@nestjs/common';
import { NavigationPublicV1Controller } from '../controllers/v1/public/navigation.controller';
import { NavigationAdminV1Controller } from '../controllers/v1/admin/navigation.controller';
import { GetPublicNavigationTreeUseCase } from '@application/navigation/use-cases/get-public-navigation-tree.use-case';
import { ListNavigationNodesUseCase } from '@application/navigation/use-cases/list-navigation-nodes.use-case';
import { CreateNavigationNodeUseCase } from '@application/navigation/use-cases/create-navigation-node.use-case';
import { UpdateNavigationNodeUseCase } from '@application/navigation/use-cases/update-navigation-node.use-case';
import { DeleteNavigationNodeUseCase } from '@application/navigation/use-cases/delete-navigation-node.use-case';
import { ReorderNavigationNodesUseCase } from '@application/navigation/use-cases/reorder-navigation-nodes.use-case';

@Module({
  controllers: [NavigationPublicV1Controller, NavigationAdminV1Controller],
  providers: [
    GetPublicNavigationTreeUseCase,
    ListNavigationNodesUseCase,
    CreateNavigationNodeUseCase,
    UpdateNavigationNodeUseCase,
    DeleteNavigationNodeUseCase,
    ReorderNavigationNodesUseCase,
  ],
})
export class NavigationPresentationModule {}
