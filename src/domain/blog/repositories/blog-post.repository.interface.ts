import { BlogPost } from '../entities/blog-post.entity';
import { BlogPostCategory } from '../entities/blog-post-category';
import type { LocalizedText } from '@shared/domain/localized-content';
import { PaginatedResult } from '@shared/types/pagination';

export interface CreateBlogPostData {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  category: BlogPostCategory;
  authorName: LocalizedText;
  authorRole: LocalizedText;
  coverImageUrl?: string | null;
  isPublished?: boolean;
  sortOrder?: number;
  publishedAt?: Date | null;
}

export interface UpdateBlogPostData {
  slug?: string;
  title?: LocalizedText;
  excerpt?: LocalizedText;
  content?: LocalizedText;
  category?: BlogPostCategory;
  authorName?: LocalizedText;
  authorRole?: LocalizedText;
  coverImageUrl?: string | null;
  isPublished?: boolean;
  sortOrder?: number;
  publishedAt?: Date | null;
}

export interface ListBlogPostsQuery {
  page?: number;
  limit?: number;
  category?: BlogPostCategory;
  publishedOnly?: boolean;
}

export interface IBlogPostRepository {
  create(data: CreateBlogPostData): Promise<BlogPost>;
  findById(id: number): Promise<BlogPost | null>;
  findBySlug(slug: string): Promise<BlogPost | null>;
  findPublishedBySlug(slug: string): Promise<BlogPost | null>;
  findAll(query: ListBlogPostsQuery): Promise<PaginatedResult<BlogPost>>;
  update(id: number, data: UpdateBlogPostData): Promise<BlogPost>;
  softDelete(id: number): Promise<void>;
  slugExists(slug: string, excludeId?: number): Promise<boolean>;
}
