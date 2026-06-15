export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteSettingsHero {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string | null;
}

export interface SiteSettingsHeader {
  logoUrl: string | null;
  siteName: string;
  navLinks: NavLink[];
}

export interface SiteSettingsFooter {
  copyright: string;
  tagline: string;
  socialLinks: SocialLink[];
}

export interface SiteSettingsSeo {
  title: string;
  description: string;
  ogImageUrl: string | null;
  keywords: string[];
}

export interface SiteSettingsContactInfo {
  email: string;
  phone: string | null;
  location: string | null;
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
    title: 'Hi, I am a Developer',
    subtitle: 'Full Stack Engineer',
    description: 'Building modern web applications.',
    ctaLabel: 'View Projects',
    ctaUrl: '/projects',
    imageUrl: null,
  },
  header: {
    logoUrl: null,
    siteName: 'Portfolio',
    navLinks: [
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  footer: {
    copyright: '© 2026 Portfolio',
    tagline: 'Built with NestJS & Next.js',
    socialLinks: [],
  },
  seo: {
    title: 'Portfolio',
    description: 'Personal portfolio website',
    ogImageUrl: null,
    keywords: ['portfolio', 'developer'],
  },
  contactInfo: {
    email: 'hello@example.com',
    phone: null,
    location: null,
    showForm: true,
  },
} as const;
