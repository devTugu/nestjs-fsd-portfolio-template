import { Experience } from '../entities/experience.entity';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateExperienceData {
  company: string;
  role: string;
  location?: string | null;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateExperienceData {
  company?: string;
  role?: string;
  location?: string | null;
  description?: string | null;
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
