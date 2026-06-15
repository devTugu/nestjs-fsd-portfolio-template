import { Skill } from '@domain/skill/entities/skill.entity';
import { SkillEntity } from '../entities/skill.entity';

export class SkillMapper {
  static toDomain(entity: SkillEntity): Skill {
    return new Skill(
      entity.id,
      entity.name,
      entity.category,
      entity.proficiency,
      entity.icon,
      entity.isPublished,
      entity.sortOrder,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
