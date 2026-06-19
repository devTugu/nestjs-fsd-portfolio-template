import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../../decorators/permissions.decorator';
import { ListNavigationNodesUseCase } from '@application/navigation/use-cases/list-navigation-nodes.use-case';
import { CreateNavigationNodeUseCase } from '@application/navigation/use-cases/create-navigation-node.use-case';
import { UpdateNavigationNodeUseCase } from '@application/navigation/use-cases/update-navigation-node.use-case';
import { DeleteNavigationNodeUseCase } from '@application/navigation/use-cases/delete-navigation-node.use-case';
import { ReorderNavigationNodesUseCase } from '@application/navigation/use-cases/reorder-navigation-nodes.use-case';
import {
  CreateNavigationNodeDto,
  NavigationScopeQueryDto,
  ReorderNavigationNodesDto,
  UpdateNavigationNodeDto,
} from '../../../dto/v1/navigation.dto';

@ApiTags('Navigation (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/navigation', version: '1' })
export class NavigationAdminV1Controller {
  constructor(
    private readonly listNavigationNodes: ListNavigationNodesUseCase,
    private readonly createNavigationNode: CreateNavigationNodeUseCase,
    private readonly updateNavigationNode: UpdateNavigationNodeUseCase,
    private readonly deleteNavigationNode: DeleteNavigationNodeUseCase,
    private readonly reorderNavigationNodes: ReorderNavigationNodesUseCase,
  ) {}

  @Get()
  @Permissions('NAV_READ')
  @ApiOperation({ summary: 'List navigation nodes (flat, admin)' })
  findAll(@Query() query: NavigationScopeQueryDto) {
    return this.listNavigationNodes.execute(query.scope);
  }

  @Post('nodes')
  @Permissions('NAV_CREATE')
  @ApiOperation({ summary: 'Create navigation node' })
  create(@Body() dto: CreateNavigationNodeDto) {
    return this.createNavigationNode.execute(dto);
  }

  @Patch('nodes/:id')
  @Permissions('NAV_UPDATE')
  @ApiOperation({ summary: 'Update navigation node' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNavigationNodeDto,
  ) {
    return this.updateNavigationNode.execute(id, dto);
  }

  @Delete('nodes/:id')
  @Permissions('NAV_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete navigation node' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteNavigationNode.execute(id);
  }

  @Put('reorder')
  @Permissions('NAV_UPDATE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Batch reorder navigation nodes' })
  async reorder(@Body() dto: ReorderNavigationNodesDto): Promise<void> {
    await this.reorderNavigationNodes.execute(
      dto.scope,
      dto.items.map((item) => ({
        id: item.id,
        parentId: item.parentId ?? null,
        sortOrder: item.sortOrder,
      })),
    );
  }
}
