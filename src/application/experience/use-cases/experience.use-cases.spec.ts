import {
  CreateExperienceUseCase,
  DeleteExperienceUseCase,
  GetExperienceUseCase,
  ListExperiencesUseCase,
  ListPublicExperiencesUseCase,
  UpdateExperienceUseCase,
} from './experience.use-cases';

describe('Experience use cases', () => {
  const experience = {
    id: 1,
    company: 'Co',
    role: 'Dev',
    location: null,
    description: null,
    startDate: new Date('2022-01-01'),
    endDate: null,
    isCurrent: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const experiences = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findAllPublished: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('creates experience', async () => {
    experiences.create.mockResolvedValue(experience);
    const result = await new CreateExperienceUseCase(
      experiences as never,
    ).execute({
      company: 'Co',
      role: 'Dev',
      startDate: '2022-01-01',
      isCurrent: true,
    });
    expect(result.company).toBe('Co');
  });

  it('gets experience', async () => {
    experiences.findById.mockResolvedValue(experience);
    const result = await new GetExperienceUseCase(
      experiences as never,
    ).execute(1);
    expect(result.id).toBe(1);
  });

  it('lists experiences', async () => {
    experiences.findAll.mockResolvedValue({
      items: [experience],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const result = await new ListExperiencesUseCase(
      experiences as never,
    ).execute({});
    expect(result.items).toHaveLength(1);
  });

  it('lists public experiences', async () => {
    experiences.findAllPublished.mockResolvedValue([experience]);
    const result = await new ListPublicExperiencesUseCase(
      experiences as never,
    ).execute();
    expect(result).toHaveLength(1);
  });

  it('updates experience', async () => {
    experiences.findById.mockResolvedValue(experience);
    experiences.update.mockResolvedValue({ ...experience, role: 'Lead' });
    const result = await new UpdateExperienceUseCase(
      experiences as never,
    ).execute(1, { role: 'Lead' });
    expect(result.role).toBe('Lead');
  });

  it('deletes experience', async () => {
    experiences.findById.mockResolvedValue(experience);
    await new DeleteExperienceUseCase(experiences as never).execute(1);
    expect(experiences.softDelete).toHaveBeenCalledWith(1);
  });
});
