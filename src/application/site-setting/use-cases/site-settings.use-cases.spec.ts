import {
  GetPublicSiteSettingsUseCase,
  GetSiteSettingsUseCase,
  UpdateSiteSettingsUseCase,
} from './site-settings.use-cases';
import {
  localizedText,
  localizedStringList,
} from '@shared/domain/localized-content';

describe('Site settings use cases', () => {
  const settings = {
    id: 1,
    hero: {
      title: localizedText('Hi', 'Сайн'),
      subtitle: localizedText('Dev', 'Dev'),
      description: localizedText('Desc', 'Тайлбар'),
      ctaLabel: localizedText('Go', 'Явах'),
      ctaUrl: '/',
      imageUrl: null,
    },
    header: {
      logoUrl: null,
      logoDarkUrl: null,
      adminLogoUrl: null,
      faviconUrl: null,
      siteName: localizedText('P', 'П'),
    },
    footer: {
      copyright: localizedText('C', 'C'),
      tagline: localizedText('T', 'T'),
      socialLinks: [],
    },
    seo: {
      title: localizedText('S', 'S'),
      description: localizedText('D', 'D'),
      ogImageUrl: null,
      keywords: localizedStringList(['k'], ['k']),
    },
    contactInfo: {
      email: 'a@b.com',
      phone: null,
      location: null,
      showForm: true,
    },
    theme: { brandColor: null },
    about: {
      brief: localizedText('About', 'Тухай'),
      mission: localizedText('Mission', 'Эрхэм зорилго'),
      vision: localizedText('Vision', 'Алсын хараа'),
      imageUrl: null,
      values: [],
      stats: [],
    },
    updatedAt: new Date(),
  };

  const repo = { get: jest.fn(), upsert: jest.fn() };

  beforeEach(() => jest.clearAllMocks());

  it('returns defaults when no row', async () => {
    repo.get.mockResolvedValue(null);
    const result = await new GetPublicSiteSettingsUseCase(repo).execute();
    expect(result.hero.title.en).toBeDefined();
  });

  it('returns stored settings', async () => {
    repo.get.mockResolvedValue(settings);
    const result = await new GetSiteSettingsUseCase(repo).execute();
    expect(result.id).toBe(1);
  });

  it('updates settings', async () => {
    repo.upsert.mockResolvedValue({
      ...settings,
      hero: {
        ...settings.hero,
        title: localizedText('Updated', 'Шинэчлэгдсэн'),
      },
    });
    const result = await new UpdateSiteSettingsUseCase(repo).execute({
      hero: { title: localizedText('Updated', 'Шинэчлэгдсэн') },
    });
    expect(result.hero.title.en).toBe('Updated');
  });

  it('updates about image url', async () => {
    repo.upsert.mockResolvedValue({
      ...settings,
      about: {
        ...settings.about,
        imageUrl: 'https://cdn.example.com/about.jpg',
      },
    });
    const result = await new UpdateSiteSettingsUseCase(repo).execute({
      about: { imageUrl: 'https://cdn.example.com/about.jpg' },
    });
    expect(result.about.imageUrl).toBe('https://cdn.example.com/about.jpg');
  });
});
