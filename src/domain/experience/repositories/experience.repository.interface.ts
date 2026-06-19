import { Experience } from '../entities/experience.entity';
import type { LocalizedText } from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateExperienceData {
  company: string;
  role: LocalizedText;
  location?: LocalizedText | null;
  description?: LocalizedText | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateExperienceData {
  company?: string;
  role?: LocalizedText;
  location?: LocalizedText | null;
  description?: LocalizedText | null;
  startDate?: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface ListExperiencesQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IExperienceRepository {
  create(data: CreateExperienceData): Promise<Experience>;
  findById(id: number): Promise<Experience | null>;
  findAll(query: ListExperiencesQuery): Promise<PaginatedResult<Experience>>;
  findAllPublished(): Promise<Experience[]>;
  update(id: number, data: UpdateExperienceData): Promise<Experience>;
  softDelete(id: number): Promise<void>;
}
