import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Public brands (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/brands returns published brands array', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/brands')
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/brands?type=RESTAURANT filters by type', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/brands?type=RESTAURANT')
      .expect(200);

    for (const brand of res.body.data) {
      expect(brand.type).toBe('RESTAURANT');
    }
  });

  it('GET /api/v1/history returns published history', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/history')
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/news returns published news posts', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/news')
      .expect(200);

    expect(res.body.data).toHaveProperty('items');
  });
});
