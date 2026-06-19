# Documentation

Multi-brand RE CMS API (v3.0.0). Start here.

## Quick links

| Guide | Purpose |
|-------|---------|
| [Getting Started](GETTING-STARTED.md) | Local setup, migrate, seed, run |
| [Architecture](ARCHITECTURE.md) | Clean Architecture layers and modules |
| [API Reference](API.md) | Public, admin, auth, and health endpoints |
| [CMS Reference](CMS-REFERENCE.md) | Entities, localized fields, permissions |
| [Security](SECURITY.md) | JWT, MFA, OIDC, audit, throttling |
| [Deployment](DEPLOYMENT.md) | Docker, Railway, production checklist |
| [Operations](OPERATIONS.md) | Runbook, backup, observability, audit retention |
| [Compliance](COMPLIANCE.md) | SOC2 mapping and regulated-enterprise checklist |
| [White Label](WHITE-LABEL.md) | Brand seeding and CMS customization |
| [Fork Guide](FORK-GUIDE.md) | Backend-only fork steps |

## Architecture decisions

| ADR | Topic |
|-----|-------|
| [001 — Clean Architecture](adr/001-clean-architecture.md) | Layer boundaries |
| [002 — Multi-brand v3](adr/002-multi-brand-v3.md) | v3 pivot and breaking changes |
| [003 — Security & identity](adr/003-security-identity.md) | Audit, OIDC, MFA |
| [004 — CMS, i18n, navigation](adr/004-cms-i18n-navigation.md) | Localized JSON, nav tree |
| [005 — White label](adr/005-white-label.md) | Deploy-time vs CMS brand |

## Paired frontend

This API pairs with [nextjs-fsd-portfolio-template](https://github.com/devTugu/nextjs-fsd-portfolio-template) v3.0.0. Use the frontend [Fork Guide](https://github.com/devTugu/nextjs-fsd-portfolio-template/blob/main/docs/FORK-GUIDE.md) for full-stack setup.

## Removed in v3

Portfolio entities (projects, skills, experiences, pricing) were removed in v3.0.0. See [ADR 002](adr/002-multi-brand-v3.md).
