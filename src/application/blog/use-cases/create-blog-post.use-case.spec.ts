import { CreateBlogPostUseCase } from './create-blog-post.use-case';
import { localizedText } from '@shared/domain/localized-content';

describe('CreateBlogPostUseCase', () => {
  const blogPosts = {
    create: jest.fn(),
    slugExists: jest.fn(),
  };

  const input = {
    title: localizedText('New Post', 'New Post'),
    excerpt: localizedText('Excerpt', 'Excerpt'),
    content: localizedText('Content', 'Content'),
    category: 'ENGINEERING' as const,
    authorName: localizedText('Author', 'Author'),
    authorRole: localizedText('Role', 'Role'),
  };

  beforeEach(() => jest.clearAllMocks());

  it('creates blog post with generated slug', async () => {
    blogPosts.slugExists.mockResolvedValue(false);
    blogPosts.create.mockResolvedValue({
      id: 1,
      slug: 'new-post',
      ...input,
      coverImageUrl: null,
      isPublished: false,
      sortOrder: 0,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await new CreateBlogPostUseCase(blogPosts as never).execute(
      input,
    );

    expect(result.slug).toBe('new-post');
    expect(blogPosts.create).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'new-post', isPublished: false }),
    );
  });

  it('deduplicates slug when collision occurs', async () => {
    blogPosts.slugExists
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    blogPosts.create.mockResolvedValue({
      id: 2,
      slug: 'new-post-2',
      ...input,
      coverImageUrl: null,
      isPublished: false,
      sortOrder: 0,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await new CreateBlogPostUseCase(blogPosts as never).execute(input);

    expect(blogPosts.create).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'new-post-1' }),
    );
  });

  it('sets publishedAt when published on create', async () => {
    blogPosts.slugExists.mockResolvedValue(false);
    blogPosts.create.mockImplementation((data) =>
      Promise.resolve({
        id: 3,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await new CreateBlogPostUseCase(blogPosts as never).execute({
      ...input,
      isPublished: true,
    });

    expect(blogPosts.create).toHaveBeenCalledWith(
      expect.objectContaining({
        isPublished: true,
        publishedAt: expect.any(Date),
      }),
    );
  });
});
