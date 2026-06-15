import { Module } from '@nestjs/common';
import { ProjectPublicV1Controller } from '../controllers/v1/public/project.controller';
import { ProjectAdminV1Controller } from '../controllers/v1/admin/project.controller';
import { CreateProjectUseCase } from '@application/project/use-cases/create-project.use-case';
import { ListProjectsUseCase } from '@application/project/use-cases/list-projects.use-case';
import { GetProjectUseCase } from '@application/project/use-cases/get-project.use-case';
import { UpdateProjectUseCase } from '@application/project/use-cases/update-project.use-case';
import { DeleteProjectUseCase } from '@application/project/use-cases/delete-project.use-case';
import { ListPublicProjectsUseCase } from '@application/project/use-cases/list-public-projects.use-case';
import { GetPublicProjectUseCase } from '@application/project/use-cases/get-public-project.use-case';

@Module({
  controllers: [ProjectPublicV1Controller, ProjectAdminV1Controller],
  providers: [
    CreateProjectUseCase,
    ListProjectsUseCase,
    GetProjectUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
    ListPublicProjectsUseCase,
    GetPublicProjectUseCase,
  ],
})
export class ProjectPresentationModule {}
