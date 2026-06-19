import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBlogPostUseCase } from '@application/blog/use-cases/create-blog-post.use-case';
import { ListBlogPostsUseCase } from '@application/blog/use-cases/list-blog-posts.use-case';
import { GetBlogPostUseCase } from '@application/blog/use-cases/get-blog-post.use-case';
import { UpdateBlogPostUseCase } from '@application/blog/use-cases/update-blog-post.use-case';
import { DeleteBlogPostUseCase } from '@application/blog/use-cases/delete-blog-post.use-case';
import { Permissions } from '../../../decorators/permissions.decorator';
import {
  CreateBlogPostDto,
  ListBlogPostsQueryDto,
  UpdateBlogPostDto,
} from '../../../dto/v1/blog-post.dto';
import { BlogPostCategory } from '@domain/blog/entities/blog-post-category';

@ApiTags('Blog Posts (Admin) v1')
@ApiBearerAuth('access-token')
@Controller({ path: 'admin/blog-posts', version: '1' })
export class BlogPostAdminV1Controller {
  constructor(
    private readonly createBlogPost: CreateBlogPostUseCase,
    private readonly listBlogPosts: ListBlogPostsUseCase,
    private readonly getBlogPost: GetBlogPostUseCase,
    private readonly updateBlogPost: UpdateBlogPostUseCase,
    private readonly deleteBlogPost: DeleteBlogPostUseCase,
  ) {}

  @Post()
  @Permissions('BLOG_CREATE')
  @ApiOperation({ summary: 'Create blog post' })
  create(@Body() dto: CreateBlogPostDto) {
    return this.createBlogPost.execute({
      ...dto,
      category: dto.category as BlogPostCategory,
    });
  }

  @Get()
  @Permissions('BLOG_READ')
  @ApiOperation({ summary: 'List all blog posts (admin)' })
  findAll(@Query() query: ListBlogPostsQueryDto) {
    return this.listBlogPosts.execute({
      ...query,
      category: query.category as BlogPostCategory | undefined,
    });
  }

  @Get(':id')
  @Permissions('BLOG_READ')
  @ApiOperation({ summary: 'Get blog post by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getBlogPost.execute(id);
  }

  @Patch(':id')
  @Permissions('BLOG_UPDATE')
  @ApiOperation({ summary: 'Update blog post' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogPostDto,
  ) {
    return this.updateBlogPost.execute(id, {
      ...dto,
      category: dto.category as BlogPostCategory | undefined,
    });
  }

  @Delete(':id')
  @Permissions('BLOG_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete blog post' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteBlogPost.execute(id);
  }
}
