import {
  DeleteSkillUseCase,
  GetSkillUseCase,
  ListPublicSkillsUseCase,
  ListSkillsUseCase,
  UpdateSkillUseCase,
} from './skill.use-cases';

describe('Skill admin use cases', () => {
  const skill = {
    id: 1,
    name: 'TS',
    category: 'frontend',
    proficiency: 5,
    icon: null,
    isPublished: true,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const skills = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findAllPublished: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    nameCategoryExists: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('gets skill', async () => {
    skills.findById.mockResolvedValue(skill);
    const result = await new GetSkillUseCase(skills as never).execute(1);
    expect(result.name).toBe('TS');
  });

  it('lists skills', async () => {
    skills.findAll.mockResolvedValue({
      items: [skill],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const result = await new ListSkillsUseCase(skills as never).execute({});
    expect(result.items).toHaveLength(1);
  });

  it('lists public skills', async () => {
    skills.findAllPublished.mockResolvedValue([skill]);
    const result = await new ListPublicSkillsUseCase(
      skills as never,
    ).execute();
    expect(result).toHaveLength(1);
  });

  it('updates skill', async () => {
    skills.findById.mockResolvedValue(skill);
    skills.update.mockResolvedValue({ ...skill, proficiency: 4 });
    const result = await new UpdateSkillUseCase(skills as never).execute(1, {
      proficiency: 4,
    });
    expect(result.proficiency).toBe(4);
  });

  it('deletes skill', async () => {
    skills.findById.mockResolvedValue(skill);
    await new DeleteSkillUseCase(skills as never).execute(1);
    expect(skills.softDelete).toHaveBeenCalledWith(1);
  });

  it('throws on duplicate name and category', async () => {
    skills.findById.mockResolvedValue(skill);
    skills.nameCategoryExists.mockResolvedValue(true);
    await expect(
      new UpdateSkillUseCase(skills as never).execute(1, { name: 'React' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });
});
