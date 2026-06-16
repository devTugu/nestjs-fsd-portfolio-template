import { GetDashboardStatsUseCase } from './get-dashboard-stats.use-case';

describe('GetDashboardStatsUseCase', () => {
  const users = { findAll: jest.fn() };
  const roles = { findAll: jest.fn() };
  const permissions = { findAll: jest.fn() };
  const projects = { findAll: jest.fn() };
  const skills = { findAll: jest.fn() };
  const experiences = { findAll: jest.fn() };
  const contactMessages = { findAll: jest.fn() };

  let useCase: GetDashboardStatsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetDashboardStatsUseCase(
      users as never,
      roles as never,
      permissions as never,
      projects as never,
      skills as never,
      experiences as never,
      contactMessages as never,
    );
  });

  it('returns only counts for granted read permissions', async () => {
    users.findAll.mockResolvedValue({ total: 3 });
    projects.findAll.mockResolvedValue({ total: 7 });

    const result = await useCase.execute(['USER_READ', 'PROJECT_READ']);

    expect(result).toEqual({ users: 3, projects: 7 });
    expect(roles.findAll).not.toHaveBeenCalled();
  });

  it('returns contact message breakdown when permitted', async () => {
    contactMessages.findAll
      .mockResolvedValueOnce({ total: 2 })
      .mockResolvedValueOnce({ total: 1 })
      .mockResolvedValueOnce({ total: 0 })
      .mockResolvedValueOnce({ total: 3 });

    const result = await useCase.execute(['CONTACT_READ']);

    expect(result.contactMessages).toEqual({
      new: 2,
      read: 1,
      archived: 0,
      total: 3,
    });
  });
});
