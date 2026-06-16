import {
  DeleteContactMessageUseCase,
  ListContactMessagesUseCase,
  UpdateContactMessageStatusUseCase,
} from './contact.use-cases';

describe('Contact admin use cases', () => {
  const message = {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    subject: null,
    message: 'Hello there!',
    status: 'NEW' as const,
    ipAddress: null,
    createdAt: new Date(),
  };

  const messages = {
    findById: jest.fn(),
    findAll: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('lists messages', async () => {
    messages.findAll.mockResolvedValue({
      items: [message],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const result = await new ListContactMessagesUseCase(
      messages as never,
    ).execute({});
    expect(result.items).toHaveLength(1);
  });

  it('updates status', async () => {
    messages.findById.mockResolvedValue(message);
    messages.updateStatus.mockResolvedValue({ ...message, status: 'READ' });
    const result = await new UpdateContactMessageStatusUseCase(
      messages as never,
    ).execute(1, 'READ');
    expect(result.status).toBe('READ');
  });

  it('deletes message', async () => {
    messages.findById.mockResolvedValue(message);
    await new DeleteContactMessageUseCase(messages as never).execute(1);
    expect(messages.delete).toHaveBeenCalledWith(1);
  });
});
