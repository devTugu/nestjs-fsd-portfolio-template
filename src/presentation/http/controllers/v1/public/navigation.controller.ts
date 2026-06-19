import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators/public.decorator';
import { GetPublicNavigationTreeUseCase } from '@application/navigation/use-cases/get-public-navigation-tree.use-case';
import { NavigationScopeQueryDto } from '../../../dto/v1/navigation.dto';

@ApiTags('Navigation (Public) v1')
@Controller({ path: 'navigation', version: '1' })
export class NavigationPublicV1Controller {
  constructor(
    private readonly getPublicNavigationTree: GetPublicNavigationTreeUseCase,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get published navigation tree by scope' })
  findTree(@Query() query: NavigationScopeQueryDto) {
    return this.getPublicNavigationTree.execute(query.scope);
  }
}
