import { Inject, Injectable } from '@nestjs/common';
import { IBlogPostRepository } from '@domain/blog/repositories/blog-post.repository.interface';
import { BlogPostCategory } from '@domain/blog/entities/blog-post-category';
import {
  BlogPostOutput,
  toBlogPostOutput,
} from '../dto/blog-post-output.mapper';
import { BLOG_POST_REPOSITORY } from '@shared/constants/tokens';
import type { LocalizedText } from '@shared/domain/localized-content';
import { generateSlug, generateUniqueSlug } from '@shared/utils/generate-slug';

@Injectable()
export class CreateBlogPostUseCase {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPosts: IBlogPostRepository,
  ) {}

  async execute(input: {
    title: LocalizedText;
    slug?: string;
    excerpt: LocalizedText;
    content: LocalizedText;
    category: BlogPostCategory;
    authorName: LocalizedText;
    authorRole: LocalizedText;
    coverImageUrl?: string | null;
    isPublished?: boolean;
    sortOrder?: number;
  }): Promise<BlogPostOutput> {
    const slug = await this.resolveUniqueSlug(
      input.slug ?? generateSlug(input.title.en),
    );
    const isPublished = input.isPublished ?? false;
    const post = await this.blogPosts.create({
      ...input,
      slug,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    });
    return toBlogPostOutput(post);
  }

  private async resolveUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let suffix = 0;
    while (await this.blogPosts.slugExists(slug)) {
      suffix += 1;
      slug = generateUniqueSlug(baseSlug, suffix);
    }
    return slug;
  }
}
