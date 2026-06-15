import {
  GetPublicSiteSettingsUseCase,
  GetSiteSettingsUseCase,
  UpdateSiteSettingsUseCase,
} from './site-settings.use-cases';

describe('Site settings use cases', () => {
  const settings = {
    id: 1,
    hero: {
      title: 'Hi',
      subtitle: 'Dev',
      description: 'Desc',
      ctaLabel: 'Go',
      ctaUrl: '/',
      imageUrl: null,
    },
    header: { logoUrl: null, siteName: 'P', navLinks: [] },
    footer: { copyright: 'C', tagline: 'T', socialLinks: [] },
    seo: { title: 'S', description: 'D', ogImageUrl: null, keywords: [] },
    contactInfo: {
      email: 'a@b.com',
      phone: null,
      location: null,
      showForm: true,
    },
    updatedAt: new Date(),
  };

  const repo = { get: jest.fn(), upsert: jest.fn() };

  beforeEach(() => jest.clearAllMocks());

  it('returns defaults when no row', async () => {
    repo.get.mockResolvedValue(null);
    const result = await new GetPublicSiteSettingsUseCase(
      repo as never,
    ).execute();
    expect(result.hero.title).toBeDefined();
  });

  it('returns stored settings', async () => {
    repo.get.mockResolvedValue(settings);
    const result = await new GetSiteSettingsUseCase(repo as never).execute();
    expect(result.id).toBe(1);
  });

  it('updates settings', async () => {
    repo.upsert.mockResolvedValue({
      ...settings,
      hero: { ...settings.hero, title: 'Updated' },
    });
    const result = await new UpdateSiteSettingsUseCase(
      repo as never,
    ).execute({ hero: { title: 'Updated' } });
    expect(result.hero.title).toBe('Updated');
  });
});
