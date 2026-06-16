# ADR 007: Dashboard Stats Endpoint

## Status

Accepted

## Context

The admin dashboard needs aggregate counts across users, roles, projects, skills, experiences, and contact messages. Multiple `GET` list calls with `limit=1` are wasteful.

## Decision

Expose `GET /api/v1/admin/dashboard/stats` via `GetDashboardStatsUseCase`. Counts are filtered server-side by the caller's JWT `permissionCodes`.

## Consequences

- Single optimized endpoint for dashboard cards
- Frontend pairs with `useDashboardStats()` (see nextjs-fsd-portfolio-template ADR 007)
