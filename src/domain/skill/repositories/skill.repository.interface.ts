import { Skill } from '../entities/skill.entity';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateSkillData {
  name: string;
  category: string;
  proficiency: number;
  icon?: string | null;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateSkillData {
  name?: string;
  category?: string;
  proficiency?: number;
  icon?: string | null;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface ListSkillsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface ISkillRepository {
  create(data: CreateSkillData): Promise<Skill>;
  findById(id: number): Promise<Skill | null>;
  findAll(query: ListSkillsQuery): Promise<PaginatedResult<Skill>>;
  findAllPublished(category?: string): Promise<Skill[]>;
  update(id: number, data: UpdateSkillData): Promise<Skill>;
  softDelete(id: number): Promise<void>;
  nameCategoryExists(
    name: string,
    category: string,
    excludeId?: number,
  ): Promise<boolean>;
}
