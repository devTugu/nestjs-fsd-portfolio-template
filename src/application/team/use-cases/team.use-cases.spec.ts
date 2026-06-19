import { TeamMember } from '@domain/team/entities/team-member.entity';
import { localizedText } from '@shared/domain/localized-content';
import {
  CreateTeamMemberUseCase,
  DeleteTeamMemberUseCase,
  GetTeamMemberUseCase,
  ListPublicTeamUseCase,
  ListTeamMembersUseCase,
  UpdateTeamMemberUseCase,
} from './team.use-cases';

describe('Team use cases', () => {
  const now = new Date();

  const member = new TeamMember(
    1,
    'Alex Smith',
    localizedText('Engineer', 'Engineer'),
    null,
    [],
    0,
    true,
    now,
    now,
  );

  const team = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findAllPublished: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('CreateTeamMemberUseCase creates member', async () => {
    team.create.mockResolvedValue(member);
    const result = await new CreateTeamMemberUseCase(team as never).execute({
      name: 'Alex Smith',
      role: localizedText('Engineer', 'Engineer'),
    });
    expect(result.id).toBe(1);
  });

  it('UpdateTeamMemberUseCase updates member', async () => {
    team.findById.mockResolvedValue(member);
    team.update.mockResolvedValue({ ...member, name: 'Sam Lee' });
    const result = await new UpdateTeamMemberUseCase(team as never).execute(1, {
      name: 'Sam Lee',
    });
    expect(result.name).toBe('Sam Lee');
  });

  it('UpdateTeamMemberUseCase throws NOT_FOUND', async () => {
    team.findById.mockResolvedValue(null);
    await expect(
      new UpdateTeamMemberUseCase(team as never).execute(1, {}),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('GetTeamMemberUseCase returns member', async () => {
    team.findById.mockResolvedValue(member);
    const result = await new GetTeamMemberUseCase(team as never).execute(1);
    expect(result.id).toBe(1);
  });

  it('GetTeamMemberUseCase throws NOT_FOUND', async () => {
    team.findById.mockResolvedValue(null);
    await expect(
      new GetTeamMemberUseCase(team as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListTeamMembersUseCase maps paginated items', async () => {
    team.findAll.mockResolvedValue({
      items: [member],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
    const result = await new ListTeamMembersUseCase(team as never).execute({});
    expect(result.items).toHaveLength(1);
  });

  it('DeleteTeamMemberUseCase soft deletes', async () => {
    team.findById.mockResolvedValue(member);
    await new DeleteTeamMemberUseCase(team as never).execute(1);
    expect(team.softDelete).toHaveBeenCalledWith(1);
  });

  it('DeleteTeamMemberUseCase throws NOT_FOUND', async () => {
    team.findById.mockResolvedValue(null);
    await expect(
      new DeleteTeamMemberUseCase(team as never).execute(1),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('ListPublicTeamUseCase returns published members', async () => {
    team.findAllPublished.mockResolvedValue([member]);
    const result = await new ListPublicTeamUseCase(team as never).execute();
    expect(result).toHaveLength(1);
  });
});
