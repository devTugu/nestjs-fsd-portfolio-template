import { Inject, Injectable } from '@nestjs/common';
import { IBlogPostRepository } from '@domain/blog/repositories/blog-post.repository.interface';
import { BlogPostCategory } from '@domain/blog/entities/blog-post-category';
import {
  BlogPostOutput,
  toBlogPostOutput,
} from '../dto/blog-post-output.mapper';
import { PaginatedResult } from '@shared/types/pagination';
import { BLOG_POST_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class ListBlogPostsUseCase {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPosts: IBlogPostRepository,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    category?: BlogPostCategory;
  }): Promise<PaginatedResult<BlogPostOutput>> {
    const result = await this.blogPosts.findAll(query);
    return {
      ...result,
      items: result.items.map((p) => toBlogPostOutput(p)),
    };
  }
}
