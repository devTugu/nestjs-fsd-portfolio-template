import { Experience } from '@domain/experience/entities/experience.entity';
import { localizedText } from '@shared/domain/localized-content';
import { toExperienceOutput } from './experience-output.mapper';

describe('toExperienceOutput', () => {
  it('formats Date fields', () => {
    const experience = new Experience(
      1,
      'Acme',
      localizedText('Engineer', 'Инженер'),
      null,
      null,
      new Date('2022-01-15T00:00:00.000Z'),
      new Date('2024-06-01T00:00:00.000Z'),
      false,
      true,
      0,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-02T00:00:00.000Z'),
    );

    const result = toExperienceOutput(experience);

    expect(result.startDate).toBe('2022-01-15');
    expect(result.endDate).toBe('2024-06-01');
  });

  it('formats MySQL date strings returned by TypeORM', () => {
    const experience = new Experience(
      1,
      'Acme',
      localizedText('Engineer', 'Инженер'),
      null,
      null,
      '2022-01-15' as unknown as Date,
      '2024-06-01' as unknown as Date,
      false,
      true,
      0,
      '2024-01-01 10:00:00' as unknown as Date,
      '2024-01-02 10:00:00' as unknown as Date,
    );

    const result = toExperienceOutput(experience);

    expect(result.startDate).toBe('2022-01-15');
    expect(result.endDate).toBe('2024-06-01');
    expect(result.createdAt).toContain('2024-01-01');
  });
});
