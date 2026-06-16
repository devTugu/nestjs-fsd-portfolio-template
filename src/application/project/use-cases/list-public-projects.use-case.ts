import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '@domain/project/repositories/project.repository.interface';
import { ProjectOutput, toProjectOutput } from '../dto/project-output.mapper';
import { PROJECT_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class ListPublicProjectsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projects: IProjectRepository,
  ) {}

  async execute(query: {
    featured?: boolean;
    limit?: number;
  }): Promise<ProjectOutput[]> {
    const items = await this.projects.findAllPublished(query);
    return items.map((p) => toProjectOutput(p));
  }
}
