import {
  localizedText,
  localizedStringList,
} from '@shared/domain/localized-content';

const L = localizedText;

export function resolveSeedBrandName(): string {
  return process.env.SEED_BRAND_NAME?.trim() || 'Portfolio';
}

export function resolveSeedContactEmail(): string {
  return process.env.SEED_CONTACT_EMAIL?.trim() || 'hello@example.com';
}

export function buildDemoSiteSettings() {
  const brandName = resolveSeedBrandName();

  return {
    id: 1,
    hero: {
      title: L('Hi, I am a Developer', 'Сайн байна уу, би хөгжүүлэгч'),
      subtitle: L('Full Stack Engineer', 'Full Stack инженер'),
      description: L(
        'Building modern web applications with clean architecture.',
        'Clean architecture-тай орчин үеийн веб аппликейшн хөгжүүлж байна.',
      ),
      ctaLabel: L('View Projects', 'Төслүүд үзэх'),
      ctaUrl: '/projects',
      imageUrl: null,
    },
    header: {
      logoUrl: null,
      logoDarkUrl: null,
      adminLogoUrl: null,
      faviconUrl: null,
      siteName: L(brandName, brandName),
    },
    footer: {
      copyright: L(`© 2026 ${brandName}`, `© 2026 ${brandName}`),
      tagline: L(
        'Built with NestJS & Next.js',
        'NestJS & Next.js-ээр бүтээгдсэн',
      ),
      socialLinks: [
        { platform: 'github', url: 'https://github.com/example' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/example' },
      ],
    },
    seo: {
      title: L(
        `${brandName} | Full Stack Developer`,
        `${brandName} | Full Stack хөгжүүлэгч`,
      ),
      description: L(
        'Personal portfolio showcasing projects and experience.',
        'Төсөл болон туршлагаа харуулсан хувийн портфолио.',
      ),
      ogImageUrl: null,
      keywords: localizedStringList(
        ['portfolio', 'developer', 'full stack'],
        ['портфолио', 'хөгжүүлэгч', 'full stack'],
      ),
    },
    contactInfo: {
      email: resolveSeedContactEmail(),
      phone: null,
      location: L('Remote', 'Алсын'),
      showForm: true,
    },
  };
}
