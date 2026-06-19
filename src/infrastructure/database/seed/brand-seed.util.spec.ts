import {
  buildDemoSiteSettings,
  resolveSeedBrandName,
  resolveSeedContactEmail,
} from './brand-seed.util';

describe('brand-seed.util', () => {
  const originalBrand = process.env.SEED_BRAND_NAME;
  const originalEmail = process.env.SEED_CONTACT_EMAIL;

  afterEach(() => {
    if (originalBrand === undefined) {
      delete process.env.SEED_BRAND_NAME;
    } else {
      process.env.SEED_BRAND_NAME = originalBrand;
    }
    if (originalEmail === undefined) {
      delete process.env.SEED_CONTACT_EMAIL;
    } else {
      process.env.SEED_CONTACT_EMAIL = originalEmail;
    }
  });

  it('uses env brand name in demo site settings', () => {
    process.env.SEED_BRAND_NAME = 'Acme Corp';
    const settings = buildDemoSiteSettings();
    expect(settings.header.siteName.en).toBe('Acme Corp');
    expect(settings.footer.copyright.en).toContain('Acme Corp');
  });

  it('uses env contact email in demo site settings', () => {
    process.env.SEED_CONTACT_EMAIL = 'hello@acme.test';
    const settings = buildDemoSiteSettings();
    expect(settings.contactInfo.email).toBe('hello@acme.test');
  });

  it('falls back to defaults when env is unset', () => {
    delete process.env.SEED_BRAND_NAME;
    delete process.env.SEED_CONTACT_EMAIL;
    expect(resolveSeedBrandName()).toBe('Mongolia Food Group');
    expect(resolveSeedContactEmail()).toBe('hello@example.com');
  });
});
