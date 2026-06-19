import {
  localizedText,
  localizedStringList,
} from '@shared/domain/localized-content';

const L = localizedText;

export const DEMO_BLOG_POSTS = [
  {
    slug: 'building-regulated-enterprise-portfolio',
    title: L(
      'Building a Regulated Enterprise Portfolio Platform',
      'Regulated Enterprise портфолио платформ бүтээх',
    ),
    excerpt: L(
      'How we paired NestJS Clean Architecture with a Next.js admin to ship audit, MFA, and GDPR workflows without reinventing the stack.',
      'NestJS Clean Architecture болон Next.js admin-ийг хослуулан audit, MFA, GDPR workflow-уудыг stack-ийг дахин бүтээлгүйгээр хэрхэн хүргэсэн бэ.',
    ),
    content: L(
      '## Why a regulated foundation matters\n\nPortfolio sites are often treated as marketing afterthoughts. For teams deploying in regulated environments, the admin layer needs the same rigor as core product APIs: RBAC, audit trails, identity controls, and data lifecycle tooling.\n\n## Architecture choices\n\nWe split the system into a NestJS API (Clean Architecture) and a Next.js FSD admin. Public marketing pages consume the same CMS content as the dashboard, so portfolio data stays single-sourced.\n\n## Security controls\n\n- Permission codes enforced on every admin mutation\n- Optional Redis-backed permission cache with invalidation on role changes\n- Audit read API with retention scheduling\n- Generic OIDC SSO plus TOTP MFA enrollment\n- GDPR export and erasure workflows for user records\n\n## Deployment\n\nThe template ships with Docker, Railway guides, and Helm charts so you can validate locally and promote the same images to Kubernetes.\n\n## Next steps\n\nFork the template, run migrations and seed, customize site settings, and extend modules (blog, pricing, projects) through the established repository and use-case pattern.',
      '## Яагаад regulated суурь чухал вэ\n\nПортфолио сайтуудыг ихэвчлэн marketing-ийн дараагийн санаа гэж үздэг. Regulated орчинд admin давхар нь core product API-тай иж түвшний RBAC, audit trail, identity control, data lifecycle шаардлагатай.\n\n## Архитектур\n\nNestJS API (Clean Architecture) болон Next.js FSD admin. Public marketing хуудсууд dashboard-тай иж CMS контент ашиглана.\n\n## Аюулгүй байдал\n\n- Permission code бүх mutation дээр\n- Redis permission cache\n- Audit read API\n- OIDC SSO + TOTP MFA\n- GDPR export/erasure\n\n## Дараагийн алхам\n\nTemplate fork хийж, migration + seed ажиллуулж, site settings тохируулна.',
    ),
    category: 'ENGINEERING' as const,
    authorName: L('Platform Team', 'Platform баг'),
    authorRole: L('Engineering', 'Инженерчлэл'),
    coverImageUrl: null,
    isPublished: true,
    sortOrder: 0,
  },
];

export const DEMO_PRICING_PLANS = [
  {
    slug: 'starter',
    name: L('Starter', 'Starter'),
    description: L(
      'For individual developers launching a personal portfolio with CMS-backed content.',
      'CMS контенттой хувийн портфолио эхлүүлэх хөгжүүлэгчид.',
    ),
    priceLabel: L('$0', '$0'),
    priceNote: L('Open source — self-hosted', 'Open source — self-hosted'),
    features: localizedStringList(
      [
        'Public portfolio site',
        'Projects, skills, and experience CMS',
        'Admin dashboard with RBAC',
        'Docker Compose local stack',
        'Community support',
      ],
      [
        'Public портфолио сайт',
        'Projects, skills, experience CMS',
        'RBAC admin dashboard',
        'Docker Compose local stack',
        'Community дэмжлэг',
      ],
    ),
    ctaLabel: L('View on GitHub', 'GitHub дээр үзэх'),
    ctaUrl: 'https://github.com/example/portfolio-template',
    isHighlighted: false,
    sortOrder: 0,
    isPublished: true,
  },
  {
    slug: 'pro',
    name: L('Pro', 'Pro'),
    description: L(
      'For agencies and product teams who need regulated controls and managed deployment paths.',
      'Regulated control болон managed deployment хэрэгтэй agency, product багуудад.',
    ),
    priceLabel: L('$49', '$49'),
    priceNote: L('per seat / month', 'суудал / сар'),
    features: localizedStringList(
      [
        'Everything in Starter',
        'Audit log read API and retention',
        'MFA and OIDC SSO integration',
        'Railway and Helm deployment guides',
        'Email support',
      ],
      [
        'Starter-ийн бүх зүйл',
        'Audit log read API болон retention',
        'MFA болон OIDC SSO интеграц',
        'Railway болон Helm deployment guide',
        'Email дэмжлэг',
      ],
    ),
    ctaLabel: L('Start Pro trial', 'Pro trial эхлүүлэх'),
    ctaUrl: '/contact',
    isHighlighted: true,
    sortOrder: 1,
    isPublished: true,
  },
  {
    slug: 'enterprise',
    name: L('Enterprise', 'Enterprise'),
    description: L(
      'For organizations with compliance requirements, custom SLAs, and dedicated onboarding.',
      'Compliance шаардлагатай, custom SLA, dedicated onboarding-тай байгууллагад.',
    ),
    priceLabel: L('Custom', 'Тусгай'),
    priceNote: L('annual agreement', 'жилийн гэрээ'),
    features: localizedStringList(
      [
        'Everything in Pro',
        'GDPR export and erasure workflows',
        'OpenTelemetry and Sentry hooks',
        'Custom identity provider mapping',
        'Dedicated solutions engineer',
      ],
      [
        'Pro-ийн бүх зүйл',
        'GDPR export болон erasure workflow',
        'OpenTelemetry болон Sentry hooks',
        'Custom identity provider mapping',
        'Dedicated solutions engineer',
      ],
    ),
    ctaLabel: L('Contact sales', 'Борлуулалттай холбогдох'),
    ctaUrl: '/contact',
    isHighlighted: false,
    sortOrder: 2,
    isPublished: true,
  },
];

export const DEMO_PRICING_FEATURE_ROWS = [
  {
    productName: L('CMS content modules', 'CMS контент модулиуд'),
    starterValue: L(
      'Projects, skills, experience',
      'Projects, skills, experience',
    ),
    proValue: L(
      'All Starter modules + blog & pricing',
      'Starter бүх модуль + blog & pricing',
    ),
    enterpriseValue: L(
      'All modules + custom extensions',
      'Бүх модуль + custom extension',
    ),
    sortOrder: 0,
  },
  {
    productName: L('RBAC roles', 'RBAC role-ууд'),
    starterValue: L('3 built-in roles', '3 built-in role'),
    proValue: L('Unlimited custom roles', 'Хязгааргүй custom role'),
    enterpriseValue: L(
      'Unlimited + SCIM-ready patterns',
      'Хязгааргүй + SCIM-ready pattern',
    ),
    sortOrder: 1,
  },
  {
    productName: L('Audit log retention', 'Audit log retention'),
    starterValue: L('7 days', '7 хоног'),
    proValue: L('90 days', '90 хоног'),
    enterpriseValue: L('Custom retention policy', 'Custom retention бодлого'),
    sortOrder: 2,
  },
  {
    productName: L('MFA & SSO', 'MFA & SSO'),
    starterValue: L('—', '—'),
    proValue: L('TOTP MFA', 'TOTP MFA'),
    enterpriseValue: L('TOTP + OIDC SSO', 'TOTP + OIDC SSO'),
    sortOrder: 3,
  },
  {
    productName: L('Deployment targets', 'Deployment зорилго'),
    starterValue: L('Docker Compose', 'Docker Compose'),
    proValue: L('Railway + Helm', 'Railway + Helm'),
    enterpriseValue: L('Multi-region Kubernetes', 'Multi-region Kubernetes'),
    sortOrder: 4,
  },
  {
    productName: L('Support', 'Дэмжлэг'),
    starterValue: L('Community', 'Community'),
    proValue: L('Email', 'Email'),
    enterpriseValue: L('Dedicated engineer', 'Dedicated инженер'),
    sortOrder: 5,
  },
];
