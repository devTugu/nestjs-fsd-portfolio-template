import { Experience } from '@domain/experience/entities/experience.entity';
import { coerceLocalizedText } from '@shared/domain/localized-content.mapper';
import { ExperienceEntity } from '../entities/experience.entity';

export class ExperienceMapper {
  static toDomain(entity: ExperienceEntity): Experience {
    return new Experience(
      entity.id,
      entity.company,
      coerceLocalizedText(entity.role),
      entity.location ? coerceLocalizedText(entity.location) : null,
      entity.description ? coerceLocalizedText(entity.description) : null,
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
