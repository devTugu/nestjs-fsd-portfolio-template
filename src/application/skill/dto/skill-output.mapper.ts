import { Skill } from '@domain/skill/entities/skill.entity';

export interface SkillOutput {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function toSkillOutput(skill: Skill): SkillOutput {
  return {
    id: skill.id,
    name: skill.name,
    category: skill.category,
    proficiency: skill.proficiency,
    icon: skill.icon,
    isPublished: skill.isPublished,
    sortOrder: skill.sortOrder,
    createdAt: skill.createdAt.toISOString(),
    updatedAt: skill.updatedAt.toISOString(),
  };
}
