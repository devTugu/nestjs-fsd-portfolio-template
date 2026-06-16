import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '@domain/project/repositories/project.repository.interface';
import { ProjectOutput, toProjectOutput } from '../dto/project-output.mapper';
import { PaginatedResult } from '@shared/types/pagination';
import { PROJECT_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class ListProjectsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projects: IProjectRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    featured?: boolean;
  }): Promise<PaginatedResult<ProjectOutput>> {
    const result = await this.projects.findAll(query);
    return {
      ...result,
      items: result.items.map((p) => toProjectOutput(p)),
    };
  }
}
