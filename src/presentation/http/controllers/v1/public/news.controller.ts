import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../decorators/public.decorator';
import { ListPublicBlogPostsUseCase } from '@application/blog/use-cases/list-public-blog-posts.use-case';
import { GetPublicBlogPostUseCase } from '@application/blog/use-cases/get-public-blog-post.use-case';
import { ListPublicBlogPostsQueryDto } from '../../../dto/v1/blog-post.dto';
import { BlogPostCategory } from '@domain/blog/entities/blog-post-category';

@ApiTags('News (Public) v1')
@Controller({ path: 'news', version: '1' })
export class NewsPublicV1Controller {
  constructor(
    private readonly listPublicBlogPosts: ListPublicBlogPostsUseCase,
    private readonly getPublicBlogPost: GetPublicBlogPostUseCase,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published news posts' })
  findAll(@Query() query: ListPublicBlogPostsQueryDto) {
    return this.listPublicBlogPosts.execute({
      ...query,
      category: query.category as BlogPostCategory | undefined,
    });
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get published news post by slug' })
  findOne(@Param('slug') slug: string) {
    return this.getPublicBlogPost.execute(slug);
  }
}
