import { SiteSettings } from '@domain/site-setting/entities/site-settings.entity';
import { SiteSettingEntity } from '../entities/site-setting.entity';

export class SiteSettingMapper {
  static toDomain(entity: SiteSettingEntity): SiteSettings {
    return new SiteSettings(
      entity.id,
      entity.hero,
      entity.header,
      entity.footer,
      entity.seo,
      entity.contactInfo,
      entity.updatedAt,
    );
  }
}
