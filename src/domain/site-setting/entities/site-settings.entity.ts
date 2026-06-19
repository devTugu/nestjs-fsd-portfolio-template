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
  secondaryCtaLabel: LocalizedText;
  secondaryCtaUrl: string;
  imageUrl: string | null;
}

export interface SiteSettingsHeader {
  logoUrl: string | null;
  logoDarkUrl: string | null;
  adminLogoUrl: string | null;
  faviconUrl: string | null;
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
  address: LocalizedText | null;
  workHours: LocalizedText | null;
  showForm: boolean;
}

export interface SiteSettingsTheme {
  brandColor: string | null;
}

export interface AboutValue {
  icon: string;
  label: LocalizedText;
}

export interface AboutStat {
  label: LocalizedText;
  value: string;
}

export interface SiteSettingsAbout {
  brief: LocalizedText;
  mission: LocalizedText;
  vision: LocalizedText;
  values: AboutValue[];
  stats: AboutStat[];
}

export class SiteSettings {
  constructor(
    public readonly id: number,
    public readonly hero: SiteSettingsHero,
    public readonly header: SiteSettingsHeader,
    public readonly footer: SiteSettingsFooter,
    public readonly seo: SiteSettingsSeo,
    public readonly contactInfo: SiteSettingsContactInfo,
    public readonly theme: SiteSettingsTheme,
    public readonly about: SiteSettingsAbout,
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
    ctaLabel: localizedText('View Brands', 'Брэндүүд үзэх'),
    ctaUrl: '/brands',
    secondaryCtaLabel: localizedText('Contact Us', 'Холбоо барих'),
    secondaryCtaUrl: '/contact',
    imageUrl: null,
  },
  header: {
    logoUrl: null,
    logoDarkUrl: null,
    adminLogoUrl: null,
    faviconUrl: null,
    siteName: localizedText('Your Site', 'Таны сайт'),
  },
  footer: {
    copyright: localizedText('© 2026 Your Site', '© 2026 Таны сайт'),
    tagline: localizedText(
      'Built with NestJS & Next.js',
      'NestJS & Next.js-ээр бүтээгдсэн',
    ),
    socialLinks: [],
  },
  seo: {
    title: localizedText('Your Site', 'Таны сайт'),
    description: localizedText(
      'Enterprise multi-brand platform',
      'Enterprise олон брэндийн платформ',
    ),
    ogImageUrl: null,
    keywords: localizedStringList(
      ['brands', 'restaurant', 'events'],
      ['брэнд', 'ресторан', 'арга хэмжээ'],
    ),
  },
  contactInfo: {
    email: 'hello@example.com',
    phone: null,
    location: localizedText('Remote', 'Алсын'),
    address: null,
    workHours: localizedText('Mon–Fri 9:00–18:00', 'Да–Ба 9:00–18:00'),
    showForm: true,
  },
  theme: {
    brandColor: null,
  },
  about: {
    brief: localizedText(
      'We build memorable brands across restaurants and events.',
      'Бид ресторан болон арга хэмжээний брэндүүдийг бүтээнэ.',
    ),
    mission: localizedText(
      'Deliver exceptional experiences through our brands.',
      'Брэндүүдээрээ онцгой туршлага өгнө.',
    ),
    vision: localizedText(
      'Become the leading multi-brand group in our region.',
      'Манай бүсийн тэргүүлэгч олон брэндийн групп болно.',
    ),
    values: [
      {
        icon: 'heart',
        label: localizedText('Quality', 'Чанар'),
      },
      {
        icon: 'users',
        label: localizedText('Teamwork', 'Багийн ажил'),
      },
    ],
    stats: [
      {
        label: localizedText('Years', 'Жил'),
        value: '10+',
      },
      {
        label: localizedText('Brands', 'Брэнд'),
        value: '4+',
      },
    ],
  },
} as const;
