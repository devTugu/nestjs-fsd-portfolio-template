import { SubmitContactMessageUseCase } from './contact.use-cases';

describe('SubmitContactMessageUseCase', () => {
  const messages = { create: jest.fn() };
  const notifications = { sendContactNotification: jest.fn() };
  const useCase = new SubmitContactMessageUseCase(
    messages as never,
    notifications as never,
  );

  it('submits valid contact message', async () => {
    messages.create.mockResolvedValue({
      id: 1,
      name: 'John',
      email: 'john@example.com',
      subject: null,
      message: 'Hello there!',
      status: 'NEW',
      ipAddress: '127.0.0.1',
      createdAt: new Date(),
    });

    const result = await useCase.execute({
      name: 'John',
      email: 'john@example.com',
      message: 'Hello there!',
    });

    expect(result.email).toBe('john@example.com');
  });

  it('rejects honeypot submissions', async () => {
    await expect(
      useCase.execute({
        name: 'Bot',
        email: 'bot@example.com',
        message: 'spam message here',
        website: 'http://spam.com',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });

  it('rejects short message', async () => {
    await expect(
      useCase.execute({
        name: 'John',
        email: 'john@example.com',
        message: 'short',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });
});
