import { Experience } from '@domain/experience/entities/experience.entity';
import { ExperienceEntity } from '../entities/experience.entity';

export class ExperienceMapper {
  static toDomain(entity: ExperienceEntity): Experience {
    return new Experience(
      entity.id,
      entity.company,
      entity.role,
      entity.location,
      entity.description,
      ExperienceMapper.coerceDate(entity.startDate),
      entity.endDate ? ExperienceMapper.coerceDate(entity.endDate) : null,
      entity.isCurrent,
      entity.isPublished,
      entity.sortOrder,
      ExperienceMapper.coerceDate(entity.createdAt),
      ExperienceMapper.coerceDate(entity.updatedAt),
    );
  }

  private static coerceDate(value: Date | string): Date {
    return value instanceof Date ? value : new Date(value);
  }
}
