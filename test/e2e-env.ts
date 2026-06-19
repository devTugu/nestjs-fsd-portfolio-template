/**
 * Align e2e with CI (.github/workflows/ci.yml) so seeded SUPER_ADMIN can log in
 * without forced MFA enrollment during tests.
 */
process.env.MFA_REQUIRED_ROLES = 'CONTENT_MANAGER';
process.env.NODE_ENV = 'test';
