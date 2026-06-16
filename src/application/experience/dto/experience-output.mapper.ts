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

function toDateOnlyString(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const normalized = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(normalized)) {
    return normalized.slice(0, 10);
  }

  return new Date(normalized).toISOString().slice(0, 10);
}

function toIsoDateTimeString(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

export function toExperienceOutput(experience: Experience): ExperienceOutput {
  return {
    id: experience.id,
    company: experience.company,
    role: experience.role,
    location: experience.location,
    description: experience.description,
    startDate: toDateOnlyString(experience.startDate as Date | string),
    endDate: experience.endDate
      ? toDateOnlyString(experience.endDate as Date | string)
      : null,
    isCurrent: experience.isCurrent,
    isPublished: experience.isPublished,
    sortOrder: experience.sortOrder,
    createdAt: toIsoDateTimeString(experience.createdAt as Date | string),
    updatedAt: toIsoDateTimeString(experience.updatedAt as Date | string),
  };
}
