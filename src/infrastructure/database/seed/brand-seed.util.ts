import {
  localizedText,
  localizedStringList,
} from '@shared/domain/localized-content';

const L = localizedText;

export function resolveSeedBrandName(): string {
  return process.env.SEED_BRAND_NAME?.trim() || 'Mongolia Food Group';
}

export function resolveSeedContactEmail(): string {
  return process.env.SEED_CONTACT_EMAIL?.trim() || 'hello@example.com';
}

export function buildDemoSiteSettings() {
  const brandName = resolveSeedBrandName();

  return {
    id: 1,
    hero: {
      title: L(`Welcome to ${brandName}`, `${brandName}-д тавтай морил`),
      subtitle: L(
        'Restaurant & Event Brands',
        'Ресторан & Арга хэмжээний брэнд',
      ),
      description: L(
        'Discover our collection of restaurants and event venues.',
        'Манай ресторан болон арга хэмжээний танхимуудыг танилцуулъя.',
      ),
      ctaLabel: L('Explore Brands', 'Брэндүүд үзэх'),
      ctaUrl: '/brands',
      secondaryCtaLabel: L('Contact Us', 'Холбоо барих'),
      secondaryCtaUrl: '/contact',
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
        'Quality brands, memorable experiences.',
        'Чанартай брэнд, мартагдашгүй туршлага.',
      ),
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/example' },
        { platform: 'instagram', url: 'https://instagram.com/example' },
      ],
    },
    seo: {
      title: L(
        `${brandName} | Multi-Brand Group`,
        `${brandName} | Олон брэндийн групп`,
      ),
      description: L(
        'Restaurants and event venues under one roof.',
        'Нэг дээвэр дорх ресторан болон арга хэмжээний танхимууд.',
      ),
      ogImageUrl: null,
      keywords: localizedStringList(
        ['restaurant', 'events', 'brands'],
        ['ресторан', 'арга хэмжээ', 'брэнд'],
      ),
    },
    contactInfo: {
      email: resolveSeedContactEmail(),
      phone: '+976 9911 2233',
      location: L('Ulaanbaatar, Mongolia', 'Улаанбаатар, Монгол'),
      address: L(
        'Sukhbaatar District, Peace Avenue 17',
        'Сүхбаатар дүүрэг, Энхтайваны өргөн чөлөө 17',
      ),
      workHours: L('Mon–Sun 10:00–22:00', 'Да–Ня 10:00–22:00'),
      showForm: true,
    },
    theme: {
      brandColor: '#635bff',
    },
    about: {
      brief: L(
        'We operate leading restaurant and event brands across Mongolia.',
        'Бид Монголд тэргүүлэгч ресторан болон арга хэмжээний брэндүүдийг удирдана.',
      ),
      mission: L(
        'Deliver exceptional dining and event experiences.',
        'Онцгой хоол, уух зүйл болон арга хэмжээний туршлага өгнө.',
      ),
      vision: L(
        'Become the most trusted multi-brand hospitality group.',
        'Хамгийн найдвартай олон брэндийн зочлох үйлчилгээний групп болно.',
      ),
      values: [
        { icon: 'heart', label: L('Quality', 'Чанар') },
        { icon: 'users', label: L('Hospitality', 'Зочломтгой байдал') },
        { icon: 'sparkles', label: L('Innovation', 'Шинэлэг байдал') },
      ],
      stats: [
        { label: L('Years', 'Жил'), value: '12+' },
        { label: L('Brands', 'Брэнд'), value: '4' },
        { label: L('Guests yearly', 'Жилийн зочид'), value: '50K+' },
      ],
    },
  };
}
