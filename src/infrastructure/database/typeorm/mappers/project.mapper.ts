import { Project } from '@domain/project/entities/project.entity';
import { ProjectEntity } from '../entities/project.entity';

export class ProjectMapper {
  static toDomain(entity: ProjectEntity): Project {
    return new Project(
      entity.id,
      entity.slug,
      entity.title,
      entity.shortDescription,
      entity.description,
      entity.thumbnailUrl,
      entity.images ?? [],
      entity.techStack ?? [],
      entity.liveUrl,
      entity.repoUrl,
      entity.isFeatured,
      entity.isPublished,
      entity.sortOrder,
      entity.publishedAt,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
