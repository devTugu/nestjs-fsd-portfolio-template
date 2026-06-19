import { BlogPost } from '@domain/blog/entities/blog-post.entity';
import { BlogPostCategory } from '@domain/blog/entities/blog-post-category';
import type { LocalizedText } from '@shared/domain/localized-content';

export interface BlogPostOutput {
  id: number;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  category: BlogPostCategory;
  authorName: LocalizedText;
  authorRole: LocalizedText;
  coverImageUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toBlogPostOutput(post: BlogPost): BlogPostOutput {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    authorName: post.authorName,
    authorRole: post.authorRole,
    coverImageUrl: post.coverImageUrl,
    isPublished: post.isPublished,
    sortOrder: post.sortOrder,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}
