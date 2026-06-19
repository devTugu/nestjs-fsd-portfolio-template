import { Inject, Injectable } from '@nestjs/common';
import { IBlogPostRepository } from '@domain/blog/repositories/blog-post.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import {
  BlogPostOutput,
  toBlogPostOutput,
} from '../dto/blog-post-output.mapper';
import { BLOG_POST_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class GetBlogPostUseCase {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPosts: IBlogPostRepository,
  ) {}

  async execute(id: number): Promise<BlogPostOutput> {
    const post = await this.blogPosts.findById(id);
    if (!post) throw AppErrors.NOT_FOUND('Blog post not found.');
    return toBlogPostOutput(post);
  }
}
