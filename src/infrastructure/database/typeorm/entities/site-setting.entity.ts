import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import {
  SiteSettingsAbout,
  SiteSettingsContactInfo,
  SiteSettingsFooter,
  SiteSettingsHeader,
  SiteSettingsHero,
  SiteSettingsSeo,
  SiteSettingsTheme,
} from '@domain/site-setting/entities/site-settings.entity';

@Entity({ name: 'site_settings' })
export class SiteSettingEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'json' })
  hero: SiteSettingsHero;

  @Column({ type: 'json' })
  header: SiteSettingsHeader;

  @Column({ type: 'json' })
  footer: SiteSettingsFooter;

  @Column({ type: 'json' })
  seo: SiteSettingsSeo;

  @Column({ name: 'contact_info', type: 'json' })
  contactInfo: SiteSettingsContactInfo;

  @Column({ type: 'json', default: () => "'{}'" })
  theme: SiteSettingsTheme;

  @Column({ type: 'json', default: () => "'{}'" })
  about: SiteSettingsAbout;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
