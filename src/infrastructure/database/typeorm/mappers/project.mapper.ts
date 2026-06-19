import { Project, ProjectImage } from '@domain/project/entities/project.entity';
import { coerceLocalizedText } from '@shared/domain/localized-content.mapper';
import { ProjectEntity } from '../entities/project.entity';

function mapImages(images: ProjectEntity['images']): ProjectImage[] {
  if (!images) return [];

  return images.map((image) => ({
    url: image.url,
    alt: image.alt ? coerceLocalizedText(image.alt) : undefined,
  }));
}

export class ProjectMapper {
  static toDomain(entity: ProjectEntity): Project {
    return new Project(
      entity.id,
      entity.slug,
      coerceLocalizedText(entity.title),
      coerceLocalizedText(entity.shortDescription),
      coerceLocalizedText(entity.description),
      entity.thumbnailUrl,
      mapImages(entity.images),
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
