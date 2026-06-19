import { Project, ProjectImage } from '../entities/project.entity';
import type { LocalizedText } from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateProjectData {
  slug: string;
  title: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  thumbnailUrl?: string | null;
  images?: ProjectImage[];
  techStack: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
  publishedAt?: Date | null;
}

export interface UpdateProjectData {
  slug?: string;
  title?: LocalizedText;
  shortDescription?: LocalizedText;
  description?: LocalizedText;
  thumbnailUrl?: string | null;
  images?: ProjectImage[];
  techStack?: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
  publishedAt?: Date | null;
}

export interface ListProjectsQuery {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
  publishedOnly?: boolean;
}

export interface IProjectRepository {
  create(data: CreateProjectData): Promise<Project>;
  findById(id: number): Promise<Project | null>;
  findBySlug(slug: string): Promise<Project | null>;
  findPublishedBySlug(slug: string): Promise<Project | null>;
  findAll(query: ListProjectsQuery): Promise<PaginatedResult<Project>>;
  findAllPublished(query: {
    featured?: boolean;
    limit?: number;
  }): Promise<Project[]>;
  update(id: number, data: UpdateProjectData): Promise<Project>;
  softDelete(id: number): Promise<void>;
  slugExists(slug: string, excludeId?: number): Promise<boolean>;
}
