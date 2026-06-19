export const BLOG_POST_CATEGORIES = [
  'PRODUCT',
  'ENGINEERING',
  'CORPORATE',
  'INDUSTRY',
] as const;

export type BlogPostCategory = (typeof BLOG_POST_CATEGORIES)[number];
