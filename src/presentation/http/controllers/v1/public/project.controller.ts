import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators/public.decorator';
import { ListPublicProjectsUseCase } from '@application/project/use-cases/list-public-projects.use-case';
import { GetPublicProjectUseCase } from '@application/project/use-cases/get-public-project.use-case';
import { ListPublicProjectsQueryDto } from '../../../dto/v1/project.dto';

@ApiTags('Projects (Public) v1')
@Controller({ path: 'projects', version: '1' })
export class ProjectPublicV1Controller {
  constructor(
    private readonly listPublicProjects: ListPublicProjectsUseCase,
    private readonly getPublicProject: GetPublicProjectUseCase,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published projects' })
  findAll(@Query() query: ListPublicProjectsQueryDto) {
    return this.listPublicProjects.execute(query);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get published project by slug' })
  findOne(@Param('slug') slug: string) {
    return this.getPublicProject.execute(slug);
  }
}
