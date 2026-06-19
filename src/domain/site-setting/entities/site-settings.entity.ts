import {
  localizedText,
  localizedStringList,
  type LocalizedStringList,
  type LocalizedText,
} from '@shared/domain/localized-content';

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteSettingsHero {
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  ctaLabel: LocalizedText;
  ctaUrl: string;
  imageUrl: string | null;
}

export interface SiteSettingsHeader {
  logoUrl: string | null;
  siteName: LocalizedText;
}

export interface SiteSettingsFooter {
  copyright: LocalizedText;
  tagline: LocalizedText;
  socialLinks: SocialLink[];
}

export interface SiteSettingsSeo {
  title: LocalizedText;
  description: LocalizedText;
  ogImageUrl: string | null;
  keywords: LocalizedStringList;
}

export interface SiteSettingsContactInfo {
  email: string;
  phone: string | null;
  location: LocalizedText | null;
  showForm: boolean;
}

export class SiteSettings {
  constructor(
    public readonly id: number,
    public readonly hero: SiteSettingsHero,
    public readonly header: SiteSettingsHeader,
    public readonly footer: SiteSettingsFooter,
    public readonly seo: SiteSettingsSeo,
    public readonly contactInfo: SiteSettingsContactInfo,
    public readonly updatedAt: Date,
  ) {}
}

export const DEFAULT_SITE_SETTINGS = {
  id: 1,
  hero: {
    title: localizedText(
      'Hi, I am a Developer',
      'Сайн байна уу, би хөгжүүлэгч',
    ),
    subtitle: localizedText('Full Stack Engineer', 'Full Stack инженер'),
    description: localizedText(
      'Building modern web applications.',
      'Орчин үеийн веб аппликейшн хөгжүүлж байна.',
    ),
    ctaLabel: localizedText('View Projects', 'Төслүүд үзэх'),
    ctaUrl: '/projects',
    imageUrl: null,
  },
  header: {
    logoUrl: null,
    siteName: localizedText('Portfolio', 'Портфолио'),
  },
  footer: {
    copyright: localizedText('© 2026 Portfolio', '© 2026 Портфолио'),
    tagline: localizedText(
      'Built with NestJS & Next.js',
      'NestJS & Next.js-ээр бүтээгдсэн',
    ),
    socialLinks: [],
  },
  seo: {
    title: localizedText('Portfolio', 'Портфолио'),
    description: localizedText(
      'Personal portfolio website',
      'Хувийн портфолио веб сайт',
    ),
    ogImageUrl: null,
    keywords: localizedStringList(
      ['portfolio', 'developer'],
      ['портфолио', 'хөгжүүлэгч'],
    ),
  },
  contactInfo: {
    email: 'hello@example.com',
    phone: null,
    location: localizedText('Remote', 'Алсын'),
    showForm: true,
  },
} as const;
