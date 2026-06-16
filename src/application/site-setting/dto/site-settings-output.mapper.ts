import { SiteSettings } from '@domain/site-setting/entities/site-settings.entity';

export interface SiteSettingsOutput {
  id: number;
  hero: SiteSettings['hero'];
  header: SiteSettings['header'];
  footer: SiteSettings['footer'];
  seo: SiteSettings['seo'];
  contactInfo: SiteSettings['contactInfo'];
  updatedAt: string;
}

export function toSiteSettingsOutput(
  settings: SiteSettings,
): SiteSettingsOutput {
  return {
    id: settings.id,
    hero: settings.hero,
    header: settings.header,
    footer: settings.footer,
    seo: settings.seo,
    contactInfo: settings.contactInfo,
    updatedAt: settings.updatedAt.toISOString(),
  };
}
