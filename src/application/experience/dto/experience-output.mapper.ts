import { Experience } from '@domain/experience/entities/experience.entity';

export interface ExperienceOutput {
  id: number;
  company: string;
  role: string;
  location: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function toExperienceOutput(experience: Experience): ExperienceOutput {
  return {
    id: experience.id,
    company: experience.company,
    role: experience.role,
    location: experience.location,
    description: experience.description,
    startDate: experience.startDate.toISOString().slice(0, 10),
    endDate: experience.endDate
      ? experience.endDate.toISOString().slice(0, 10)
      : null,
    isCurrent: experience.isCurrent,
    isPublished: experience.isPublished,
    sortOrder: experience.sortOrder,
    createdAt: experience.createdAt.toISOString(),
    updatedAt: experience.updatedAt.toISOString(),
  };
}
