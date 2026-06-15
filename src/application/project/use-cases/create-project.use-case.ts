import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '@domain/project/repositories/project.repository.interface';
import { ProjectOutput, toProjectOutput } from '../dto/project-output.mapper';
import { PROJECT_REPOSITORY } from '@shared/constants/tokens';
import { generateSlug, generateUniqueSlug } from '@shared/utils/generate-slug';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projects: IProjectRepository,
  ) {}

  async execute(input: {
    title: string;
    slug?: string;
    shortDescription: string;
    description: string;
    thumbnailUrl?: string | null;
    images?: { url: string; alt?: string }[];
    techStack: string[];
    liveUrl?: string | null;
    repoUrl?: string | null;
    isFeatured?: boolean;
    isPublished?: boolean;
    sortOrder?: number;
  }): Promise<ProjectOutput> {
    const slug = await this.resolveUniqueSlug(
      input.slug ?? generateSlug(input.title),
    );
    const isPublished = input.isPublished ?? false;
    const project = await this.projects.create({
      ...input,
      slug,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    });
    return toProjectOutput(project);
  }

  private async resolveUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let suffix = 0;
    while (await this.projects.slugExists(slug)) {
      suffix += 1;
      slug = generateUniqueSlug(baseSlug, suffix);
    }
    return slug;
  }
}
