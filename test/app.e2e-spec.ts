import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createE2eApp } from './e2e-setup';

describe('Application (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health/live returns 200', () => {
    return request(app.getHttpServer()).get('/api/v1/health/live').expect(200);
  });

  it('GET /api/v1/health/ready returns 200', () => {
    return request(app.getHttpServer()).get('/api/v1/health/ready').expect(200);
  });
});

describe('Auth and RBAC (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/auth/login returns tokens for seeded admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com',
        password: process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!',
      })
      .expect(200);

    const body = response.body.data ?? response.body;
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
    accessToken = body.accessToken;
    refreshToken = body.refreshToken;
  });

  it('GET /api/v1/auth/me returns profile with token', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = response.body.data ?? response.body;
    expect(body.email).toBe(
      process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com',
    );
    expect(Array.isArray(body.permissionCodes)).toBe(true);
    expect(body.permissionCodes.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/users returns 200 for admin', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('GET /api/v1/users returns 401 without token', () => {
    return request(app.getHttpServer()).get('/api/v1/users').expect(401);
  });

  it('POST /api/v1/auth/refresh rotates tokens', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    const body = response.body.data ?? response.body;
    expect(body.accessToken).toBeDefined();
    accessToken = body.accessToken;
    refreshToken = body.refreshToken;
  });

  it('POST /api/v1/auth/logout revokes session', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken })
      .expect(204);
  });
});

describe('Public CMS API (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;

  beforeAll(async () => {
    app = await createE2eApp();
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com',
        password: process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!',
      });
    const body = login.body.data ?? login.body;
    accessToken = body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/brands returns 200 without token', () => {
    return request(app.getHttpServer()).get('/api/v1/brands').expect(200);
  });

  it('GET /api/v1/history returns 200 without token', () => {
    return request(app.getHttpServer()).get('/api/v1/history').expect(200);
  });

  it('GET /api/v1/site-settings returns 200 without token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/site-settings')
      .expect(200);
  });

  it('GET /api/v1/news returns 200 without token', () => {
    return request(app.getHttpServer()).get('/api/v1/news').expect(200);
  });

  it('GET /api/v1/navigation returns 200 without token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/navigation?scope=HEADER')
      .expect(200);
  });

  it('POST /api/v1/contact creates message', () => {
    return request(app.getHttpServer())
      .post('/api/v1/contact')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello from e2e test message',
      })
      .expect(201);
  });

  it('POST /api/v1/contact rejects honeypot', () => {
    return request(app.getHttpServer())
      .post('/api/v1/contact')
      .send({
        name: 'Bot',
        email: 'bot@example.com',
        message: 'Spam message here',
        website: 'http://spam.test',
      })
      .expect(400);
  });

  it('POST /api/v1/admin/brands creates brand for admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/brands')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: { en: 'E2E Test Brand', mn: 'E2E Test Brand' },
        slug: 'e2e-test-brand',
        type: 'RESTAURANT',
        description: {
          en: 'E2E brand description',
          mn: 'E2E brand description',
        },
        isPublished: false,
        sortOrder: 99,
      })
      .expect(201);

    const body = response.body.data ?? response.body;
    expect(body.slug).toBe('e2e-test-brand');
  });

  it('POST /api/v1/admin/blog-posts creates blog post for admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/blog-posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: { en: 'E2E Blog Post', mn: 'E2E Blog Post' },
        excerpt: { en: 'Short excerpt for e2e', mn: 'Short excerpt for e2e' },
        content: {
          en: 'Long content body for e2e blog post test',
          mn: 'Long content body for e2e blog post test',
        },
        category: 'PRODUCT',
        authorName: { en: 'E2E Author', mn: 'E2E Author' },
        authorRole: { en: 'Tester', mn: 'Tester' },
        isPublished: false,
      })
      .expect(201);

    const body = response.body.data ?? response.body;
    expect(body.slug).toBeDefined();
  });

  it('GET /api/v1/admin/brands returns 401 without token', () => {
    return request(app.getHttpServer()).get('/api/v1/admin/brands').expect(401);
  });

  it('GET unpublished brand by slug returns 404', () => {
    return request(app.getHttpServer())
      .get('/api/v1/brands/e2e-test-brand')
      .expect(404);
  });
});
