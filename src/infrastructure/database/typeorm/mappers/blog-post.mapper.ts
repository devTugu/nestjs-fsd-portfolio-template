import { BlogPost } from '@domain/blog/entities/blog-post.entity';
import { coerceLocalizedText } from '@shared/domain/localized-content.mapper';
import { BlogPostEntity } from '../entities/blog-post.entity';

export class BlogPostMapper {
  static toDomain(entity: BlogPostEntity): BlogPost {
    return new BlogPost(
      entity.id,
      entity.slug,
      coerceLocalizedText(entity.title),
      coerceLocalizedText(entity.excerpt),
      coerceLocalizedText(entity.content),
      entity.category,
      coerceLocalizedText(entity.authorName),
      coerceLocalizedText(entity.authorRole),
      entity.coverImageUrl,
      entity.isPublished,
      entity.sortOrder,
      entity.publishedAt,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
