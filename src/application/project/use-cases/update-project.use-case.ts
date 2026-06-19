import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '@domain/project/repositories/project.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { ProjectOutput, toProjectOutput } from '../dto/project-output.mapper';
import { PROJECT_REPOSITORY } from '@shared/constants/tokens';
import type { LocalizedText } from '@shared/domain/localized-content';
import { generateSlug, generateUniqueSlug } from '@shared/utils/generate-slug';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projects: IProjectRepository,
  ) {}

  async execute(
    id: number,
    input: {
      title?: LocalizedText;
      slug?: string;
      shortDescription?: LocalizedText;
      description?: LocalizedText;
      thumbnailUrl?: string | null;
      images?: { url: string; alt?: LocalizedText }[];
      techStack?: string[];
      liveUrl?: string | null;
      repoUrl?: string | null;
      isFeatured?: boolean;
      isPublished?: boolean;
      sortOrder?: number;
    },
  ): Promise<ProjectOutput> {
    const existing = await this.projects.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Project not found.');

    const updateData: Parameters<IProjectRepository['update']>[1] = {
      ...input,
    };

    if (input.slug !== undefined) {
      if (await this.projects.slugExists(input.slug, id)) {
        throw AppErrors.CONFLICT('Slug is already in use.');
      }
    } else if (
      input.title !== undefined &&
      input.title.en !== existing.title.en
    ) {
      const baseSlug = generateSlug(input.title.en);
      updateData.slug = await this.resolveUniqueSlug(baseSlug, id);
    }

    if (input.isPublished === true && !existing.isPublished) {
      updateData.publishedAt = new Date();
    }
    if (input.isPublished === false) {
      updateData.publishedAt = null;
    }

    const project = await this.projects.update(id, updateData);
    return toProjectOutput(project);
  }

  private async resolveUniqueSlug(
    baseSlug: string,
    excludeId: number,
  ): Promise<string> {
    let slug = baseSlug;
    let suffix = 0;
    while (await this.projects.slugExists(slug, excludeId)) {
      suffix += 1;
      slug = generateUniqueSlug(baseSlug, suffix);
    }
    return slug;
  }
}
