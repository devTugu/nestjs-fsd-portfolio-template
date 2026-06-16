import { DeleteProjectUseCase } from './delete-project.use-case';
import { GetProjectUseCase } from './get-project.use-case';
import { ListProjectsUseCase } from './list-projects.use-case';
import { ListPublicProjectsUseCase } from './list-public-projects.use-case';
import { UpdateProjectUseCase } from './update-project.use-case';

describe('Project use cases', () => {
  const project = {
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
    isPublished: false,
    sortOrder: 0,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const projects = {
    findById: jest.fn(),
    findPublishedBySlug: jest.fn(),
    findAll: jest.fn(),
    findAllPublished: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    slugExists: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('GetProjectUseCase returns project', async () => {
    projects.findById.mockResolvedValue(project);
    const result = await new GetProjectUseCase(projects as never).execute(1);
    expect(result.id).toBe(1);
  });

  it('GetProjectUseCase throws NOT_FOUND', async () => {
    projects.findById.mockResolvedValue(null);
    await expect(
      new GetProjectUseCase(projects as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListProjectsUseCase maps items', async () => {
    projects.findAll.mockResolvedValue({
      items: [project],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const result = await new ListProjectsUseCase(projects as never).execute({});
    expect(result.items).toHaveLength(1);
  });

  it('ListPublicProjectsUseCase maps items', async () => {
    projects.findAllPublished.mockResolvedValue([project]);
    const result = await new ListPublicProjectsUseCase(
      projects as never,
    ).execute({});
    expect(result).toHaveLength(1);
  });

  it('UpdateProjectUseCase publishes project', async () => {
    projects.findById.mockResolvedValue(project);
    projects.slugExists.mockResolvedValue(false);
    projects.update.mockResolvedValue({ ...project, isPublished: true });
    const result = await new UpdateProjectUseCase(projects as never).execute(
      1,
      { isPublished: true },
    );
    expect(result.isPublished).toBe(true);
  });

  it('DeleteProjectUseCase soft deletes', async () => {
    projects.findById.mockResolvedValue(project);
    projects.softDelete.mockResolvedValue(undefined);
    await new DeleteProjectUseCase(projects as never).execute(1);
    expect(projects.softDelete).toHaveBeenCalledWith(1);
  });

  it('UpdateProjectUseCase throws on slug conflict', async () => {
    projects.findById.mockResolvedValue(project);
    projects.slugExists.mockResolvedValue(true);
    await expect(
      new UpdateProjectUseCase(projects as never).execute(1, {
        slug: 'taken',
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  it('UpdateProjectUseCase regenerates slug when title changes', async () => {
    projects.findById.mockResolvedValue(project);
    projects.slugExists.mockResolvedValue(false);
    projects.update.mockResolvedValue({ ...project, slug: 'new-title' });
    await new UpdateProjectUseCase(projects as never).execute(1, {
      title: 'New Title',
    });
    expect(projects.update).toHaveBeenCalled();
  });
});
