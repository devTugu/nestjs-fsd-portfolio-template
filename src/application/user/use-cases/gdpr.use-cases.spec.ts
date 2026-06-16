import { ExportUserDataUseCase, AnonymizeUserUseCase } from './gdpr.use-cases';

describe('ExportUserDataUseCase', () => {
  const users = { findById: jest.fn() };
  const useCase = new ExportUserDataUseCase(users as never);

  it('throws when user not found', async () => {
    users.findById.mockResolvedValue(null);
    await expect(useCase.execute(99)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('returns export payload with permission metadata', async () => {
    const createdAt = new Date('2024-01-01T00:00:00.000Z');
    const updatedAt = new Date('2024-06-01T00:00:00.000Z');
    users.findById.mockResolvedValue({
      id: 1,
      email: 'admin@example.com',
      isActive: true,
      roleNames: ['SUPER_ADMIN'],
      permissionCodes: ['USER_READ', 'AUDIT_READ'],
      mfaEnabled: true,
      oauthProvider: null,
      createdAt,
      updatedAt,
    });

    const result = await useCase.execute(1);

    expect(result).toEqual({
      id: 1,
      email: 'admin@example.com',
      isActive: true,
      roleNames: ['SUPER_ADMIN'],
      permissionCodes: ['USER_READ', 'AUDIT_READ'],
      mfaEnabled: true,
      oauthProvider: null,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });
});

describe('AnonymizeUserUseCase', () => {
  const users = { findById: jest.fn(), anonymize: jest.fn() };
  const useCase = new AnonymizeUserUseCase(users as never);

  it('throws when user not found', async () => {
    users.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('anonymizes existing user', async () => {
    users.findById.mockResolvedValue({ id: 1 });
    users.anonymize.mockResolvedValue(undefined);

    await useCase.execute(1);

    expect(users.anonymize).toHaveBeenCalledWith(1);
  });
});
