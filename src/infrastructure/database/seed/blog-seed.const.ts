import { localizedText } from '@shared/domain/localized-content';

const L = localizedText;

export const DEMO_BLOG_POSTS = [
  {
    slug: 'building-regulated-enterprise-portfolio',
    title: L(
      'Building a Regulated Enterprise Multi-Brand Platform',
      'Regulated Enterprise олон брэнд платформ бүтээх',
    ),
    excerpt: L(
      'How we paired NestJS Clean Architecture with a Next.js admin to ship audit, MFA, and GDPR workflows without reinventing the stack.',
      'NestJS Clean Architecture болон Next.js admin-ийг хослуулан audit, MFA, GDPR workflow-уудыг stack-ийг дахин бүтээлгүйгээр хэрхэн хүргэсэн бэ.',
    ),
    content: L(
      '## Why a regulated foundation matters\n\nPublic marketing sites are often treated as afterthoughts. For teams deploying in regulated environments, the admin layer needs the same rigor as core product APIs: RBAC, audit trails, identity controls, and data lifecycle tooling.\n\n## Architecture choices\n\nWe split the system into a NestJS API (Clean Architecture) and a Next.js FSD admin. Public marketing pages consume the same CMS content as the dashboard, so brand and news content stays single-sourced.\n\n## Security controls\n\n- Permission codes enforced on every admin mutation\n- Optional Redis-backed permission cache with invalidation on role changes\n- Audit read API with retention scheduling\n- Generic OIDC SSO plus TOTP MFA enrollment\n- GDPR export and erasure workflows for user records\n\n## Deployment\n\nThe template ships with Docker, Railway guides, and Helm charts so you can validate locally and promote the same images to Kubernetes.\n\n## Next steps\n\nFork the template, run migrations and seed, customize site settings, and extend modules (brands, history, news) through the established repository and use-case pattern.',
      '## Яагаад regulated суурь чухал вэ\n\nPublic marketing сайтуудыг ихэвчлэн дараагийн санаа гэж үздэг. Regulated орчинд admin давхар нь core product API-тай иж түвшний RBAC, audit trail, identity control, data lifecycle шаардлагатай.\n\n## Архитектур\n\nNestJS API (Clean Architecture) болон Next.js FSD admin. Public marketing хуудсууд dashboard-тай иж CMS контент ашиглана.\n\n## Аюулгүй байдал\n\n- Permission code бүх mutation дээр\n- Redis permission cache\n- Audit read API\n- OIDC SSO + TOTP MFA\n- GDPR export/erasure\n\n## Дараагийн алхам\n\nTemplate fork хийж, migration + seed ажиллуулж, site settings тохируулна.',
    ),
    category: 'ENGINEERING' as const,
    authorName: L('Platform Team', 'Platform баг'),
    authorRole: L('Engineering', 'Инженерчлэл'),
    coverImageUrl: null,
    isPublished: true,
    sortOrder: 0,
  },
];
