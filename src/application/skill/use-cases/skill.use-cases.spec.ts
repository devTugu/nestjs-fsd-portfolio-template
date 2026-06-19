import { CreateSkillUseCase } from './skill.use-cases';
import { localizedText } from '@shared/domain/localized-content';

describe('CreateSkillUseCase', () => {
  const skills = {
    nameCategoryExists: jest.fn(),
    create: jest.fn(),
  };
  const useCase = new CreateSkillUseCase(skills as never);

  it('creates skill when unique', async () => {
    skills.nameCategoryExists.mockResolvedValue(false);
    skills.create.mockResolvedValue({
      id: 1,
      name: 'TypeScript',
      category: localizedText('frontend', 'frontend'),
      proficiency: 5,
      icon: null,
      isPublished: true,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute({
      name: 'TypeScript',
      category: localizedText('frontend', 'frontend'),
      proficiency: 5,
    });

    expect(result.name).toBe('TypeScript');
  });

  it('throws on invalid proficiency', async () => {
    await expect(
      useCase.execute({
        name: 'X',
        category: localizedText('frontend', 'frontend'),
        proficiency: 6,
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });
});
