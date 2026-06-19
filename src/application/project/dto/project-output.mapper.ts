import { Project, ProjectImage } from '@domain/project/entities/project.entity';
import type { LocalizedText } from '@shared/domain/localized-content';

export interface ProjectOutput {
  id: number;
  slug: string;
  title: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  thumbnailUrl: string | null;
  images: ProjectImage[];
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toProjectOutput(project: Project): ProjectOutput {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    description: project.description,
    thumbnailUrl: project.thumbnailUrl,
    images: project.images,
    techStack: project.techStack,
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    isFeatured: project.isFeatured,
    isPublished: project.isPublished,
    sortOrder: project.sortOrder,
    publishedAt: project.publishedAt?.toISOString() ?? null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}
