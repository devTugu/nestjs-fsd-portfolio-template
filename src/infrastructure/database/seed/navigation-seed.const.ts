import { NavigationScope } from '@domain/navigation/entities/navigation-scope';
import { NavigationNodeType } from '@domain/navigation/entities/navigation-node-type';

type L = { en: string; mn: string };

interface NavigationSeedNode {
  key: string;
  parentKey?: string;
  scope: NavigationScope;
  type: NavigationNodeType;
  labels: L;
  descriptions?: L;
  href?: string;
  sortOrder: number;
  isPublished: boolean;
  metadata?: {
    imageUrl?: string;
    ctaHref?: string;
    ctaLabel?: L;
    badge?: string;
  };
}

const L = (en: string, mn: string): L => ({ en, mn });

export const DEMO_NAVIGATION_NODES: NavigationSeedNode[] = [
  {
    key: 'header-about',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.MEGA,
    labels: L('About', 'Бидний тухай'),
    sortOrder: 0,
    isPublished: true,
  },
  {
    key: 'header-about-col-company',
    parentKey: 'header-about',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.COLUMN,
    labels: L('Company', 'Компани'),
    sortOrder: 0,
    isPublished: true,
  },
  {
    key: 'header-about-us',
    parentKey: 'header-about-col-company',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.LINK,
    labels: L('About us', 'Бидний тухай'),
    descriptions: L(
      'Mission, vision, and values',
      'Эрхэм зорилго, алсын хараа',
    ),
    href: '/about/us',
    sortOrder: 0,
    isPublished: true,
  },
  {
    key: 'header-about-history',
    parentKey: 'header-about-col-company',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.LINK,
    labels: L('History', 'Түүх'),
    descriptions: L('Our journey through the years', 'Он жилийн аялал'),
    href: '/about/history',
    sortOrder: 1,
    isPublished: true,
  },
  {
    key: 'header-about-col-people',
    parentKey: 'header-about',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.COLUMN,
    labels: L('People', 'Хүмүүс'),
    sortOrder: 1,
    isPublished: true,
  },
  {
    key: 'header-about-leadership',
    parentKey: 'header-about-col-people',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.LINK,
    labels: L('Leadership', 'Удирдлага'),
    descriptions: L('Executive team', 'Удирдах баг'),
    href: '/about/leadership',
    sortOrder: 0,
    isPublished: true,
  },
  {
    key: 'header-about-team',
    parentKey: 'header-about-col-people',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.LINK,
    labels: L('Team', 'Баг'),
    descriptions: L('Meet our team', 'Манай багтай танилц'),
    href: '/about/team',
    sortOrder: 1,
    isPublished: true,
  },
  {
    key: 'header-about-cta',
    parentKey: 'header-about',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.CTA_ROW,
    labels: L('Want to work with us?', 'Хамтран ажиллах уу?'),
    href: '/contact',
    sortOrder: 2,
    isPublished: true,
  },
  {
    key: 'header-brands',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.LINK,
    labels: L('Brands', 'Брэндүүд'),
    href: '/brands',
    sortOrder: 1,
    isPublished: true,
  },
  {
    key: 'header-news',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.LINK,
    labels: L('News', 'Мэдээ'),
    href: '/news',
    sortOrder: 2,
    isPublished: true,
  },
  {
    key: 'header-contact',
    scope: NavigationScope.HEADER,
    type: NavigationNodeType.LINK,
    labels: L('Contact', 'Холбоо барих'),
    href: '/contact',
    sortOrder: 3,
    isPublished: true,
  },

  {
    key: 'footer-company',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.GROUP,
    labels: L('Company', 'Компани'),
    sortOrder: 0,
    isPublished: true,
  },
  {
    key: 'footer-about-us',
    parentKey: 'footer-company',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.LINK,
    labels: L('About us', 'Бидний тухай'),
    href: '/about/us',
    sortOrder: 0,
    isPublished: true,
  },
  {
    key: 'footer-history',
    parentKey: 'footer-company',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.LINK,
    labels: L('History', 'Түүх'),
    href: '/about/history',
    sortOrder: 1,
    isPublished: true,
  },
  {
    key: 'footer-leadership',
    parentKey: 'footer-company',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.LINK,
    labels: L('Leadership', 'Удирдлага'),
    href: '/about/leadership',
    sortOrder: 2,
    isPublished: true,
  },
  {
    key: 'footer-team',
    parentKey: 'footer-company',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.LINK,
    labels: L('Team', 'Баг'),
    href: '/about/team',
    sortOrder: 3,
    isPublished: true,
  },

  {
    key: 'footer-brands',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.GROUP,
    labels: L('Brands', 'Брэндүүд'),
    sortOrder: 1,
    isPublished: true,
  },
  {
    key: 'footer-all-brands',
    parentKey: 'footer-brands',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.LINK,
    labels: L('All brands', 'Бүх брэнд'),
    href: '/brands',
    sortOrder: 0,
    isPublished: true,
  },
  {
    key: 'footer-restaurants',
    parentKey: 'footer-brands',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.LINK,
    labels: L('Restaurants', 'Ресторан'),
    href: '/brands?type=RESTAURANT',
    sortOrder: 1,
    isPublished: true,
  },
  {
    key: 'footer-events',
    parentKey: 'footer-brands',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.LINK,
    labels: L('Events', 'Арга хэмжээ'),
    href: '/brands?type=EVENT',
    sortOrder: 2,
    isPublished: true,
  },

  {
    key: 'footer-connect',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.GROUP,
    labels: L('Connect', 'Холбоо'),
    sortOrder: 2,
    isPublished: true,
  },
  {
    key: 'footer-news',
    parentKey: 'footer-connect',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.LINK,
    labels: L('News', 'Мэдээ'),
    href: '/news',
    sortOrder: 0,
    isPublished: true,
  },
  {
    key: 'footer-contact',
    parentKey: 'footer-connect',
    scope: NavigationScope.FOOTER,
    type: NavigationNodeType.LINK,
    labels: L('Contact', 'Холбоо барих'),
    href: '/contact',
    sortOrder: 1,
    isPublished: true,
  },
];

export type { NavigationSeedNode };
