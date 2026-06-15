import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '@domain/project/repositories/project.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { ProjectOutput, toProjectOutput } from '../dto/project-output.mapper';
import { PROJECT_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class GetPublicProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projects: IProjectRepository,
  ) {}

  async execute(slug: string): Promise<ProjectOutput> {
    const project = await this.projects.findPublishedBySlug(slug);
    if (!project) throw AppErrors.NOT_FOUND('Project not found.');
    return toProjectOutput(project);
  }
}
