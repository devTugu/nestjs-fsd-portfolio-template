import { Module } from '@nestjs/common';
import { BlogPostPublicV1Controller } from '../controllers/v1/public/blog-post.controller';
import { BlogPostAdminV1Controller } from '../controllers/v1/admin/blog-post.controller';
import { CreateBlogPostUseCase } from '@application/blog/use-cases/create-blog-post.use-case';
import { ListBlogPostsUseCase } from '@application/blog/use-cases/list-blog-posts.use-case';
import { GetBlogPostUseCase } from '@application/blog/use-cases/get-blog-post.use-case';
import { UpdateBlogPostUseCase } from '@application/blog/use-cases/update-blog-post.use-case';
import { DeleteBlogPostUseCase } from '@application/blog/use-cases/delete-blog-post.use-case';
import { ListPublicBlogPostsUseCase } from '@application/blog/use-cases/list-public-blog-posts.use-case';
import { GetPublicBlogPostUseCase } from '@application/blog/use-cases/get-public-blog-post.use-case';

@Module({
  controllers: [BlogPostPublicV1Controller, BlogPostAdminV1Controller],
  providers: [
    CreateBlogPostUseCase,
    ListBlogPostsUseCase,
    GetBlogPostUseCase,
    UpdateBlogPostUseCase,
    DeleteBlogPostUseCase,
    ListPublicBlogPostsUseCase,
    GetPublicBlogPostUseCase,
  ],
})
export class BlogPresentationModule {}
