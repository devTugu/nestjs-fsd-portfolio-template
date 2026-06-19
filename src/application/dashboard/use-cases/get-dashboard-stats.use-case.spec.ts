import { GetDashboardStatsUseCase } from './get-dashboard-stats.use-case';

describe('GetDashboardStatsUseCase', () => {
  const users = { findAll: jest.fn() };
  const roles = { findAll: jest.fn() };
  const permissions = { findAll: jest.fn() };
  const brands = { findAll: jest.fn() };
  const history = { findAll: jest.fn() };
  const blogPosts = { findAll: jest.fn() };
  const contactMessages = { findAll: jest.fn() };

  let useCase: GetDashboardStatsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetDashboardStatsUseCase(
      users as never,
      roles as never,
      permissions as never,
      brands as never,
      history as never,
      blogPosts as never,
      contactMessages as never,
    );
  });

  it('returns only counts for granted read permissions', async () => {
    users.findAll.mockResolvedValue({ total: 3 });
    brands.findAll.mockResolvedValue({ total: 7 });

    const result = await useCase.execute(['USER_READ', 'BRAND_READ']);

    expect(result).toEqual({ users: 3, brands: 7 });
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

  it('returns role count when ROLE_READ permitted', async () => {
    roles.findAll.mockResolvedValue({ total: 4 });

    const result = await useCase.execute(['ROLE_READ']);

    expect(result.roles).toBe(4);
    expect(users.findAll).not.toHaveBeenCalled();
  });

  it('returns permission count when PERMISSION_READ permitted', async () => {
    permissions.findAll.mockResolvedValue({ total: 29 });

    const result = await useCase.execute(['PERMISSION_READ']);

    expect(result.permissions).toBe(29);
  });

  it('returns history count when HISTORY_READ permitted', async () => {
    history.findAll.mockResolvedValue({ total: 6 });

    const result = await useCase.execute(['HISTORY_READ']);

    expect(result.history).toBe(6);
  });

  it('returns news count when BLOG_READ permitted', async () => {
    blogPosts.findAll.mockResolvedValue({ total: 8 });

    const result = await useCase.execute(['BLOG_READ']);

    expect(result.news).toBe(8);
  });
});
