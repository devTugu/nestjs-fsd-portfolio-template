# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 3.0.x   | Yes       |
| < 3.0   | No        |

## Reporting a vulnerability

Please **do not** open public GitHub issues for security vulnerabilities.

1. Open a [private security advisory](https://github.com/devTugu/nestjs-fsd-portfolio-template/security/advisories/new) on this repository, or email the maintainer listed in the repository profile.
2. Include steps to reproduce, impact, and affected endpoints.
3. Allow reasonable time for a fix before public disclosure.

## Secrets

- Never commit `.env` or production credentials.
- Use strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (32+ characters).
- Change default seed passwords (`SEED_ADMIN_PASSWORD`) before deployment.

## More detail

See [docs/SECURITY.md](docs/SECURITY.md) for JWT, MFA, OIDC, audit logs, and throttling.
