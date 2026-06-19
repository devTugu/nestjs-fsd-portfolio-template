import { Inject, Injectable } from '@nestjs/common';
import { IBlogPostRepository } from '@domain/blog/repositories/blog-post.repository.interface';
import { AppErrors } from '@application/exceptions/application.exception';
import { BLOG_POST_REPOSITORY } from '@shared/constants/tokens';

@Injectable()
export class DeleteBlogPostUseCase {
  constructor(
    @Inject(BLOG_POST_REPOSITORY)
    private readonly blogPosts: IBlogPostRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const post = await this.blogPosts.findById(id);
    if (!post) throw AppErrors.NOT_FOUND('Blog post not found.');
    await this.blogPosts.softDelete(id);
  }
}
