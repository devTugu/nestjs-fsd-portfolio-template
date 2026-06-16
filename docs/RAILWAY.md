# Railway Full-Stack Deployment

Deploy the portfolio API + admin frontend on [Railway](https://railway.app) with MySQL, Redis, and private networking.

## Architecture

```
Browser → Frontend (Next.js BFF) → API (NestJS) → MySQL + Redis
```

- JWT cookies are set by the Next.js BFF (`/api/auth/*`).
- The browser never calls NestJS directly.
- Use **private networking** for `API_INTERNAL_URL` on the frontend service.

## 1. Create Railway project

1. New project → add **MySQL** and **Redis** plugins.
2. Create **API** service from this repo (`nestjs-fsd-portfolio-template`).
3. Create **Frontend** service from `nextjs-fsd-portfolio-template`.

## 2. API service

**Build:** Dockerfile (see [`railway.toml`](../railway.toml))

**Variables:** copy from [`.env.railway.example`](../.env.railway.example)

| Variable | Notes |
|----------|--------|
| `PORT` | Auto-injected by Railway — do **not** set `APP_PORT` |
| `RUN_SEED` | `true` on first deploy only, then `false` |
| `CORS_ORIGIN` | Frontend public URL (e.g. `https://frontend.up.railway.app`) |
| `MFA_ENCRYPTION_KEY` | Required for SUPER_ADMIN MFA (`openssl rand -base64 32`) |
| `JWT_*_SECRET` | 32+ chars each |

**Startup:** [`scripts/railway-start.sh`](../scripts/railway-start.sh) runs migrations, optional seed, then `node dist/main.js`.

**Health check:** `GET /api/v1/health/ready`

## 3. Frontend service

**Build:** Dockerfile with Next.js `output: 'standalone'`

**Variables:** copy from frontend [`.env.railway.example`](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/.env.railway.example)

```env
API_INTERNAL_URL=http://<api-service-name>.railway.internal:<api-port>/api/v1
```

In Railway Variables UI, use service references:

```env
API_INTERNAL_URL=http://${{portfolio-api.RAILWAY_PRIVATE_DOMAIN}}:${{portfolio-api.PORT}}/api/v1
```

Set API `CORS_ORIGIN` to the frontend **public** URL.

## 4. First deploy checklist

1. Deploy API with `RUN_SEED=true`.
2. Deploy frontend with private `API_INTERNAL_URL`.
3. Open frontend `/sign-in` → login with seed admin → complete MFA on sign-in page.
4. Set `RUN_SEED=false` on API.
5. Change default admin password via dashboard.
6. Run smoke test (frontend repo):

```bash
SMOKE_BASE_URL=https://your-frontend.up.railway.app \
API_URL=https://your-api.up.railway.app \
bash scripts/smoke-railway.sh
```

## 5. Production notes

| Topic | Guidance |
|-------|----------|
| Images | Use Cloudinary / R2 / S3 URLs in CMS — no local disk on Railway |
| Contact email | Set `SMTP_*` and `CONTACT_NOTIFY_EMAIL` on API |
| Redis | Keep `REDIS_ENABLED=true` for token blacklist + rate limits |
| Swagger | `SWAGGER_ENABLED=false` in production |
| Audit purge | `AUDIT_PURGE_ENABLED=true`, `AUDIT_RETENTION_DAYS=90` |
| OIDC | Optional — see `.env.railway.example` |

## 6. CI/CD

GitHub Actions workflow `.github/workflows/railway-deploy.yml` deploys on push to `main` when `RAILWAY_TOKEN` and `RAILWAY_SERVICE_ID` secrets are configured.

## 7. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Login `ECONNREFUSED` | Check `API_INTERNAL_URL` and private networking |
| MFA 500 on enroll | Set `MFA_ENCRYPTION_KEY` (32+ chars) on API |
| CORS errors | Match `CORS_ORIGIN` to frontend public URL |
| Migrations fail | Verify MySQL plugin variables linked to API service |

See also [PRODUCTION.md](PRODUCTION.md).
