import type { LocalizedText } from '@shared/domain/localized-content';
import { BlogPostCategory } from './blog-post-category';

export class BlogPost {
  constructor(
    public readonly id: number,
    public readonly slug: string,
    public readonly title: LocalizedText,
    public readonly excerpt: LocalizedText,
    public readonly content: LocalizedText,
    public readonly category: BlogPostCategory,
    public readonly authorName: LocalizedText,
    public readonly authorRole: LocalizedText,
    public readonly coverImageUrl: string | null,
    public readonly isPublished: boolean,
    public readonly sortOrder: number,
    public readonly publishedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
