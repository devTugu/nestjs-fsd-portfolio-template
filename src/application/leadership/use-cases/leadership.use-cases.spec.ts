import { LeadershipMember } from '@domain/leadership/entities/leadership-member.entity';
import { localizedText } from '@shared/domain/localized-content';
import {
  CreateLeadershipMemberUseCase,
  DeleteLeadershipMemberUseCase,
  GetLeadershipMemberUseCase,
  ListLeadershipMembersUseCase,
  ListPublicLeadershipUseCase,
  UpdateLeadershipMemberUseCase,
} from './leadership.use-cases';

describe('Leadership use cases', () => {
  const now = new Date();

  const member = new LeadershipMember(
    1,
    'Jane Doe',
    localizedText('CEO', 'CEO'),
    localizedText('Lead with vision', 'Lead with vision'),
    null,
    [],
    0,
    true,
    now,
    now,
  );

  const leadership = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findAllPublished: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('CreateLeadershipMemberUseCase creates member', async () => {
    leadership.create.mockResolvedValue(member);
    const result = await new CreateLeadershipMemberUseCase(
      leadership as never,
    ).execute({
      name: 'Jane Doe',
      title: localizedText('CEO', 'CEO'),
      quote: localizedText('Lead with vision', 'Lead with vision'),
    });
    expect(result.id).toBe(1);
  });

  it('UpdateLeadershipMemberUseCase updates member', async () => {
    leadership.findById.mockResolvedValue(member);
    leadership.update.mockResolvedValue({ ...member, name: 'John Doe' });
    const result = await new UpdateLeadershipMemberUseCase(
      leadership as never,
    ).execute(1, { name: 'John Doe' });
    expect(result.name).toBe('John Doe');
  });

  it('UpdateLeadershipMemberUseCase throws NOT_FOUND', async () => {
    leadership.findById.mockResolvedValue(null);
    await expect(
      new UpdateLeadershipMemberUseCase(leadership as never).execute(1, {}),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('GetLeadershipMemberUseCase returns member', async () => {
    leadership.findById.mockResolvedValue(member);
    const result = await new GetLeadershipMemberUseCase(
      leadership as never,
    ).execute(1);
    expect(result.id).toBe(1);
  });

  it('GetLeadershipMemberUseCase throws NOT_FOUND', async () => {
    leadership.findById.mockResolvedValue(null);
    await expect(
      new GetLeadershipMemberUseCase(leadership as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListLeadershipMembersUseCase maps paginated items', async () => {
    leadership.findAll.mockResolvedValue({
      items: [member],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const result = await new ListLeadershipMembersUseCase(
      leadership as never,
    ).execute({});
    expect(result.items).toHaveLength(1);
  });

  it('DeleteLeadershipMemberUseCase soft deletes', async () => {
    leadership.findById.mockResolvedValue(member);
    await new DeleteLeadershipMemberUseCase(leadership as never).execute(1);
    expect(leadership.softDelete).toHaveBeenCalledWith(1);
  });

  it('DeleteLeadershipMemberUseCase throws NOT_FOUND', async () => {
    leadership.findById.mockResolvedValue(null);
    await expect(
      new DeleteLeadershipMemberUseCase(leadership as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListPublicLeadershipUseCase returns published members', async () => {
    leadership.findAllPublished.mockResolvedValue([member]);
    const result = await new ListPublicLeadershipUseCase(
      leadership as never,
    ).execute();
    expect(result).toHaveLength(1);
  });
});
