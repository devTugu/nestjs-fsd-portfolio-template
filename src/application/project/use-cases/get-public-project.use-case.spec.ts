import { GetPublicProjectUseCase } from './get-public-project.use-case';

describe('GetPublicProjectUseCase', () => {
  const projects = { findPublishedBySlug: jest.fn() };
  const useCase = new GetPublicProjectUseCase(projects as never);

  it('returns published project', async () => {
    projects.findPublishedBySlug.mockResolvedValue({
      id: 1,
      slug: 'demo',
      title: 'Demo',
      shortDescription: 'S',
      description: 'D',
      thumbnailUrl: null,
      images: [],
      techStack: [],
      liveUrl: null,
      repoUrl: null,
      isFeatured: false,
      isPublished: true,
      sortOrder: 0,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute('demo');
    expect(result.slug).toBe('demo');
  });

  it('throws NOT_FOUND when unpublished or missing', async () => {
    projects.findPublishedBySlug.mockResolvedValue(null);
    await expect(useCase.execute('missing')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });
});
