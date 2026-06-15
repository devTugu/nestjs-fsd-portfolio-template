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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectUseCase } from '@application/project/use-cases/create-project.use-case';
import { ListProjectsUseCase } from '@application/project/use-cases/list-projects.use-case';
import { GetProjectUseCase } from '@application/project/use-cases/get-project.use-case';
import { UpdateProjectUseCase } from '@application/project/use-cases/update-project.use-case';
import { DeleteProjectUseCase } from '@application/project/use-cases/delete-project.use-case';
import { Permissions } from '../../../decorators/permissions.decorator';
import {
  CreateProjectDto,
  ListProjectsQueryDto,
  UpdateProjectDto,
} from '../../../dto/v1/project.dto';

@ApiTags('Projects (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/projects', version: '1' })
export class ProjectAdminV1Controller {
  constructor(
    private readonly createProject: CreateProjectUseCase,
    private readonly listProjects: ListProjectsUseCase,
    private readonly getProject: GetProjectUseCase,
    private readonly updateProject: UpdateProjectUseCase,
    private readonly deleteProject: DeleteProjectUseCase,
  ) {}

  @Post()
  @Permissions('PROJECT_CREATE')
  @ApiOperation({ summary: 'Create project' })
  create(@Body() dto: CreateProjectDto) {
    return this.createProject.execute(dto);
  }

  @Get()
  @Permissions('PROJECT_READ')
  @ApiOperation({ summary: 'List all projects (admin)' })
  findAll(@Query() query: ListProjectsQueryDto) {
    return this.listProjects.execute(query);
  }

  @Get(':id')
  @Permissions('PROJECT_READ')
  @ApiOperation({ summary: 'Get project by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getProject.execute(id);
  }

  @Patch(':id')
  @Permissions('PROJECT_UPDATE')
  @ApiOperation({ summary: 'Update project' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.updateProject.execute(id, dto);
  }

  @Delete(':id')
  @Permissions('PROJECT_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete project' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteProject.execute(id);
  }
}
