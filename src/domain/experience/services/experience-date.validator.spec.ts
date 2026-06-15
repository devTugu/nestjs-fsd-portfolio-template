import { validateExperienceDates } from './experience-date.validator';

describe('validateExperienceDates', () => {
  it('clears end date when isCurrent is true', () => {
    const result = validateExperienceDates({
      startDate: new Date('2022-01-01'),
      isCurrent: true,
    });
    expect(result.isCurrent).toBe(true);
    expect(result.endDate).toBeNull();
  });

  it('throws when isCurrent with end date provided', () => {
    expect(() =>
      validateExperienceDates({
        startDate: new Date('2022-01-01'),
        endDate: new Date('2023-01-01'),
        isCurrent: true,
      }),
    ).toThrow();
  });

  it('throws when end date is before start date', () => {
    expect(() =>
      validateExperienceDates({
        startDate: new Date('2023-01-01'),
        endDate: new Date('2022-01-01'),
        isCurrent: false,
      }),
    ).toThrow();
  });
});
