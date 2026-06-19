import { Inject, Injectable } from '@nestjs/common';
import { IBlogPostRepository } from '@domain/blog/repositories/blog-post.repository.interface';
import { BlogPostCategory } from '@domain/blog/entities/blog-post-category';
import { AppErrors } from '@application/exceptions/application.exception';
import {
  BlogPostOutput,
  toBlogPostOutput,
} from '../dto/blog-post-output.mapper';
import { BLOG_POST_REPOSITORY } from '@shared/constants/tokens';
import type { LocalizedText } from '@shared/domain/localized-content';
import { generateSlug, generateUniqueSlug } from '@shared/utils/generate-slug';

@Injectable()
export class UpdateBlogPostUseCase {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPosts: IBlogPostRepository,
  ) {}

  async execute(
    id: number,
    input: {
      title?: LocalizedText;
      slug?: string;
      excerpt?: LocalizedText;
      content?: LocalizedText;
      category?: BlogPostCategory;
      authorName?: LocalizedText;
      authorRole?: LocalizedText;
      coverImageUrl?: string | null;
      isPublished?: boolean;
      sortOrder?: number;
    },
  ): Promise<BlogPostOutput> {
    const existing = await this.blogPosts.findById(id);
    if (!existing) throw AppErrors.NOT_FOUND('Blog post not found.');

    const updateData: Parameters<IBlogPostRepository['update']>[1] = {
      ...input,
    };

    if (input.slug !== undefined) {
      if (await this.blogPosts.slugExists(input.slug, id)) {
        throw AppErrors.CONFLICT('Slug is already in use.');
      }
    } else if (
      input.title !== undefined &&
      input.title.en !== existing.title.en
    ) {
      const baseSlug = generateSlug(input.title.en);
      updateData.slug = await this.resolveUniqueSlug(baseSlug, id);
    }

    if (input.isPublished === true && !existing.isPublished) {
      updateData.publishedAt = new Date();
    }
    if (input.isPublished === false) {
      updateData.publishedAt = null;
    }

    const post = await this.blogPosts.update(id, updateData);
    return toBlogPostOutput(post);
  }

  private async resolveUniqueSlug(
    baseSlug: string,
    excludeId: number,
  ): Promise<string> {
    let slug = baseSlug;
    let suffix = 0;
    while (await this.blogPosts.slugExists(slug, excludeId)) {
      suffix += 1;
      slug = generateUniqueSlug(baseSlug, suffix);
    }
    return slug;
  }
}
