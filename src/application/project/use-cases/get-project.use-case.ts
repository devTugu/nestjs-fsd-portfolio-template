import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '@domain/project/repositories/project.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { ProjectOutput, toProjectOutput } from '../dto/project-output.mapper';
import { PROJECT_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class GetProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projects: IProjectRepository,
  ) {}

  async execute(id: number): Promise<ProjectOutput> {
    const project = await this.projects.findById(id);
    if (!project) throw AppErrors.NOT_FOUND('Project not found.');
    return toProjectOutput(project);
  }
}
