import { DeleteBlogPostUseCase } from './delete-blog-post.use-case';
import { GetBlogPostUseCase } from './get-blog-post.use-case';
import { GetPublicBlogPostUseCase } from './get-public-blog-post.use-case';
import { ListBlogPostsUseCase } from './list-blog-posts.use-case';
import { ListPublicBlogPostsUseCase } from './list-public-blog-posts.use-case';
import { UpdateBlogPostUseCase } from './update-blog-post.use-case';
import { localizedText } from '@shared/domain/localized-content';

describe('Blog use cases', () => {
  const blogPost = {
    id: 1,
    slug: 'hello-world',
    title: localizedText('Hello World', 'Hello World'),
    excerpt: localizedText('Excerpt', 'Excerpt'),
    content: localizedText('Content body', 'Content body'),
    category: 'PRODUCT' as const,
    authorName: localizedText('Author', 'Author'),
    authorRole: localizedText('Engineer', 'Engineer'),
    coverImageUrl: null,
    isPublished: false,
    sortOrder: 0,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const blogPosts = {
    findById: jest.fn(),
    findPublishedBySlug: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    slugExists: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('GetBlogPostUseCase returns post', async () => {
    blogPosts.findById.mockResolvedValue(blogPost);
    const result = await new GetBlogPostUseCase(blogPosts as never).execute(1);
    expect(result.id).toBe(1);
  });

  it('GetBlogPostUseCase throws NOT_FOUND', async () => {
    blogPosts.findById.mockResolvedValue(null);
    await expect(
      new GetBlogPostUseCase(blogPosts as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('GetPublicBlogPostUseCase returns published post', async () => {
    blogPosts.findPublishedBySlug.mockResolvedValue(blogPost);
    const result = await new GetPublicBlogPostUseCase(
      blogPosts as never,
    ).execute('hello-world');
    expect(result.slug).toBe('hello-world');
  });

  it('GetPublicBlogPostUseCase throws NOT_FOUND', async () => {
    blogPosts.findPublishedBySlug.mockResolvedValue(null);
    await expect(
      new GetPublicBlogPostUseCase(blogPosts as never).execute('missing'),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListBlogPostsUseCase maps items', async () => {
    blogPosts.findAll.mockResolvedValue({
      items: [blogPost],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const result = await new ListBlogPostsUseCase(blogPosts as never).execute(
      {},
    );
    expect(result.items).toHaveLength(1);
  });

  it('ListPublicBlogPostsUseCase filters published only', async () => {
    blogPosts.findAll.mockResolvedValue({
      items: [blogPost],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    await new ListPublicBlogPostsUseCase(blogPosts as never).execute({});
    expect(blogPosts.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ publishedOnly: true }),
    );
  });

  it('UpdateBlogPostUseCase publishes post', async () => {
    blogPosts.findById.mockResolvedValue(blogPost);
    blogPosts.slugExists.mockResolvedValue(false);
    blogPosts.update.mockResolvedValue({ ...blogPost, isPublished: true });
    const result = await new UpdateBlogPostUseCase(blogPosts as never).execute(
      1,
      { isPublished: true },
    );
    expect(result.isPublished).toBe(true);
  });

  it('UpdateBlogPostUseCase unpublishes post', async () => {
    blogPosts.findById.mockResolvedValue({ ...blogPost, isPublished: true });
    blogPosts.update.mockResolvedValue({ ...blogPost, isPublished: false });
    await new UpdateBlogPostUseCase(blogPosts as never).execute(1, {
      isPublished: false,
    });
    expect(blogPosts.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ publishedAt: null }),
    );
  });

  it('UpdateBlogPostUseCase throws on slug conflict', async () => {
    blogPosts.findById.mockResolvedValue(blogPost);
    blogPosts.slugExists.mockResolvedValue(true);
    await expect(
      new UpdateBlogPostUseCase(blogPosts as never).execute(1, {
        slug: 'taken',
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  it('UpdateBlogPostUseCase regenerates slug when title changes', async () => {
    blogPosts.findById.mockResolvedValue(blogPost);
    blogPosts.slugExists.mockResolvedValue(false);
    blogPosts.update.mockResolvedValue({ ...blogPost, slug: 'new-title' });
    await new UpdateBlogPostUseCase(blogPosts as never).execute(1, {
      title: localizedText('New Title', 'New Title'),
    });
    expect(blogPosts.update).toHaveBeenCalled();
  });

  it('UpdateBlogPostUseCase throws NOT_FOUND', async () => {
    blogPosts.findById.mockResolvedValue(null);
    await expect(
      new UpdateBlogPostUseCase(blogPosts as never).execute(1, {}),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('DeleteBlogPostUseCase soft deletes', async () => {
    blogPosts.findById.mockResolvedValue(blogPost);
    await new DeleteBlogPostUseCase(blogPosts as never).execute(1);
    expect(blogPosts.softDelete).toHaveBeenCalledWith(1);
  });

  it('DeleteBlogPostUseCase throws NOT_FOUND', async () => {
    blogPosts.findById.mockResolvedValue(null);
    await expect(
      new DeleteBlogPostUseCase(blogPosts as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
