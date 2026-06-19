import { localizedText } from '@shared/domain/localized-content';

const L = localizedText;

export const DEMO_PROJECTS = [
  {
    slug: 'portfolio-cms',
    title: L('Portfolio CMS', 'Портфолио CMS'),
    shortDescription: L(
      'Full-stack portfolio with admin CMS',
      'Admin CMS-тай full-stack портфолио',
    ),
    description: L(
      'A production-ready portfolio template built with NestJS and Next.js featuring RBAC admin panel.',
      'RBAC admin panel-тай NestJS болон Next.js-ээр бүтээгдсэн production-ready портфолио template.',
    ),
    thumbnailUrl: null,
    images: [],
    techStack: ['NestJS', 'Next.js', 'TypeORM', 'MySQL'],
    liveUrl: null,
    repoUrl: 'https://github.com/example/portfolio',
    isFeatured: true,
    isPublished: true,
    sortOrder: 0,
  },
  {
    slug: 'ecommerce-api',
    title: L('E-Commerce API', 'E-Commerce API'),
    shortDescription: L(
      'REST API for online store',
      'Онлайн дэлгүүрийн REST API',
    ),
    description: L(
      'Scalable e-commerce backend with payment integration.',
      'Төлбөрийн интеграцтай масштаблагдах e-commerce backend.',
    ),
    thumbnailUrl: null,
    images: [],
    techStack: ['NestJS', 'PostgreSQL', 'Stripe'],
    liveUrl: null,
    repoUrl: null,
    isFeatured: false,
    isPublished: true,
    sortOrder: 1,
  },
  {
    slug: 'task-manager',
    title: L('Task Manager', 'Даалгавар менежер'),
    shortDescription: L(
      'Team task management app',
      'Багийн даалгавар удирдах апп',
    ),
    description: L(
      'Collaborative task board with real-time updates.',
      'Real-time шинэчлэлттэй хамтын даалгаврын самбар.',
    ),
    thumbnailUrl: null,
    images: [],
    techStack: ['React', 'Node.js', 'Socket.io'],
    liveUrl: null,
    repoUrl: null,
    isFeatured: false,
    isPublished: true,
    sortOrder: 2,
  },
];

export const DEMO_SKILLS = [
  {
    name: 'TypeScript',
    category: L('frontend', 'frontend'),
    proficiency: 5,
    icon: 'typescript',
    sortOrder: 0,
  },
  {
    name: 'React',
    category: L('frontend', 'frontend'),
    proficiency: 5,
    icon: 'react',
    sortOrder: 1,
  },
  {
    name: 'Next.js',
    category: L('frontend', 'frontend'),
    proficiency: 4,
    icon: 'nextjs',
    sortOrder: 2,
  },
  {
    name: 'NestJS',
    category: L('backend', 'backend'),
    proficiency: 5,
    icon: 'nestjs',
    sortOrder: 3,
  },
  {
    name: 'Node.js',
    category: L('backend', 'backend'),
    proficiency: 5,
    icon: 'nodejs',
    sortOrder: 4,
  },
  {
    name: 'MySQL',
    category: L('backend', 'backend'),
    proficiency: 4,
    icon: 'mysql',
    sortOrder: 5,
  },
  {
    name: 'Docker',
    category: L('tool', 'tool'),
    proficiency: 4,
    icon: 'docker',
    sortOrder: 6,
  },
  {
    name: 'Git',
    category: L('tool', 'tool'),
    proficiency: 5,
    icon: 'git',
    sortOrder: 7,
  },
];

export const DEMO_EXPERIENCES = [
  {
    company: 'Tech Agency',
    role: L('Senior Full Stack Developer', 'Ахлах Full Stack хөгжүүлэгч'),
    location: L('Remote', 'Алсын'),
    description: L(
      'Led development of client portfolio and SaaS projects.',
      'Үйлчлүүлэгчийн портфолио болон SaaS төслүүдийг удирдан хөгжүүлсэн.',
    ),
    startDate: '2022-01-01',
    endDate: null,
    isCurrent: true,
    isPublished: true,
    sortOrder: 0,
  },
  {
    company: 'Startup Inc',
    role: L('Backend Developer', 'Backend хөгжүүлэгч'),
    location: L('Ulaanbaatar', 'Улаанбаатар'),
    description: L(
      'Built REST APIs and database schemas for MVP products.',
      'MVP бүтээгдэхүүнүүдэд REST API болон database schema бүтээсэн.',
    ),
    startDate: '2019-06-01',
    endDate: '2021-12-31',
    isCurrent: false,
    isPublished: true,
    sortOrder: 1,
  },
];
