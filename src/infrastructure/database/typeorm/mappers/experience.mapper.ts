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
      entity.startDate,
      entity.endDate,
      entity.isCurrent,
      entity.isPublished,
      entity.sortOrder,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
