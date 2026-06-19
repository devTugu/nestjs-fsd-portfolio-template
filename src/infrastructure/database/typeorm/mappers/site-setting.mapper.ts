import { SiteSettings } from '@domain/site-setting/entities/site-settings.entity';
import { SiteSettingEntity } from '../entities/site-setting.entity';
import type { SiteSettingsHeader } from '@domain/site-setting/entities/site-settings.entity';

function normalizeHeader(header: SiteSettingsHeader): SiteSettingsHeader {
  return {
    logoUrl: header.logoUrl ?? null,
    logoDarkUrl: header.logoDarkUrl ?? null,
    adminLogoUrl: header.adminLogoUrl ?? null,
    faviconUrl: header.faviconUrl ?? null,
    siteName: header.siteName,
  };
}

export class SiteSettingMapper {
  static toDomain(entity: SiteSettingEntity): SiteSettings {
    return new SiteSettings(
      entity.id,
      entity.hero,
      normalizeHeader(entity.header),
      entity.footer,
      entity.seo,
      entity.contactInfo,
      entity.updatedAt,
    );
  }
}
