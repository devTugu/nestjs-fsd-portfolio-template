import { CreateProjectUseCase } from './create-project.use-case';

describe('CreateProjectUseCase', () => {
  const projects = {
    slugExists: jest.fn(),
    create: jest.fn(),
  };

  const useCase = new CreateProjectUseCase(projects as never);

  it('creates project with generated slug', async () => {
    projects.slugExists.mockResolvedValue(false);
    projects.create.mockResolvedValue({
      id: 1,
      slug: 'my-app',
      title: 'My App',
      shortDescription: 'Short',
      description: 'Long',
      thumbnailUrl: null,
      images: [],
      techStack: ['NestJS'],
      liveUrl: null,
      repoUrl: null,
      isFeatured: false,
      isPublished: false,
      sortOrder: 0,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute({
      title: 'My App',
      shortDescription: 'Short',
      description: 'Long',
      techStack: ['NestJS'],
    });

    expect(result.slug).toBe('my-app');
    expect(projects.create).toHaveBeenCalled();
  });
});
