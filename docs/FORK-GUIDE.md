# Fork Guide (Backend)

Steps to fork and deploy the API independently.

## 1. Fork and clone

```bash
git clone https://github.com/YOUR_ORG/nestjs-fsd-portfolio-template.git
cd nestjs-fsd-portfolio-template
npm ci
```

## 2. Configure environment

```bash
cp .env.example .env
```

Minimum: database credentials, JWT secrets, `CORS_ORIGIN`.

Customize brand seed:

```env
SEED_BRAND_NAME=Your Company Group
SEED_CONTACT_EMAIL=hello@yourcompany.com
SEED_ADMIN_EMAIL=admin@yourcompany.com
SEED_ADMIN_PASSWORD=YourSecurePassword123!
```

## 3. Database

```bash
npm run migration:run
npm run seed
```

For production first deploy, use `RUN_SEED=true` once, then disable.

## 4. Optional services

| Service | When to enable |
|---------|----------------|
| SMTP | Contact form email notifications + auto-reply |
| S3 | Admin media uploads |
| Redis | Production rate limiting + permission cache |
| OIDC | Enterprise SSO |
| MFA | `MFA_ENCRYPTION_KEY` + `MFA_REQUIRED_ROLES` |
| Sentry / OTEL | Production observability |

## 5. Deploy

See [Deployment](DEPLOYMENT.md) for Docker and Railway.

## 6. Pair frontend

Clone [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) and set:

```env
API_INTERNAL_URL=https://your-api.example.com/api/v1
```

Full-stack fork: use the frontend [Fork Guide](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/docs/FORK-GUIDE.md).

## 7. Customize content

1. Sign in as admin
2. Update site settings (logos, hero, about, brandColor)
3. Replace demo brands, history, team, news
4. Edit navigation tree

## 8. Remove demo branding

- Update `SEED_BRAND_NAME` before re-seeding empty DB
- Or edit via admin without re-seed

## License

MIT — retain license file in fork.
