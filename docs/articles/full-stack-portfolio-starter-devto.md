---
title: "I Built a Full-Stack Portfolio Starter So You Don't Have To (NestJS + Next.js)"
published: false
description: "Production-ready portfolio CMS with Clean Architecture, JWT, RBAC, and public + admin APIs — fork and ship client projects in hours."
tags: nestjs, nextjs, portfolio, typescript, webdev, opensource
cover_image:
canonical_url: https://github.com/devTugu/nestjs-fsd-portfolio-template
---

Every freelancer knows the drill: a new portfolio client arrives, and you rebuild the same CRUD — projects, skills, experience timeline, contact form, hero section — from scratch.

I already had [nestjs-fsd-template](https://github.com/devTugu/nestjs-fsd-template) (RBAC admin API) and [nextjs-fsd-template](https://github.com/devTugu/nextjs-fsd-template) (admin UI). So I extended them into **portfolio-specific templates** you can fork today.

## What's in the box

**Backend:** [nestjs-fsd-portfolio-template](https://github.com/devTugu/nestjs-fsd-portfolio-template)

- Clean Architecture (domain → application → infrastructure → presentation)
- JWT + RBAC (reuse users/roles from the base template)
- Portfolio CMS modules:
  - **Projects** (slug, featured, publish/draft, tech stack)
  - **Skills** (category, proficiency 1–5)
  - **Experiences** (timeline with current role support)
  - **Site settings** (hero, header, footer, SEO — singleton JSON)
  - **Contact** (rate-limited public form + admin inbox)
- Public read API (`@Public()`) + admin CRUD (`/admin/*`)
- Optional SMTP notifications and S3 media upload
- Demo seed content — fork and see data immediately

**Frontend (coming / pair with):** [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template)

## Architecture highlight: dual routes

```
Public site  →  GET /api/v1/projects        (no auth)
Admin CMS    →  CRUD /api/v1/admin/projects (JWT + PROJECT_* permission)
```

Draft projects never leak to the public API. Same pattern for skills, experiences, and site settings.

## Quick start

```bash
git clone https://github.com/devTugu/nestjs-fsd-portfolio-template.git
cd nestjs-fsd-portfolio-template
npm install
cp .env.example .env
npm run migration:run
npm run seed
npm run start:dev
```

Login: `admin@example.com` / `Admin123!`

Try public endpoints:

```bash
curl http://localhost:3001/api/v1/projects
curl http://localhost:3001/api/v1/site-settings
```

## Railway-friendly

Container filesystems are ephemeral. The template defaults to **URL-based images** (Cloudinary, R2, S3). Paste URLs in the CMS — no local upload required.

Optional S3 adapter for `POST /admin/media/upload` when you configure `S3_*` env vars.

## Why not a headless CMS?

For a single developer portfolio or small agency client, running Contentful/Strapi adds cost and complexity. This template gives you:

- Full code ownership
- RBAC when you need multi-admin later
- Same patterns as enterprise NestJS projects
- Type-safe API your Next.js frontend can trust

## Links

- Backend repo: https://github.com/devTugu/nestjs-fsd-portfolio-template
- API docs: [docs/API.md](https://github.com/devTugu/nestjs-fsd-portfolio-template/blob/main/docs/API.md)
- Architecture: [docs/ARCHITECTURE.md](https://github.com/devTugu/nestjs-fsd-portfolio-template/blob/main/docs/ARCHITECTURE.md)
- Base RBAC template: https://github.com/devTugu/nestjs-fsd-template

If this saves you time on your next client project, a star on the repo helps others find it.

---

*Built by [@devTugu](https://github.com/devTugu)*
