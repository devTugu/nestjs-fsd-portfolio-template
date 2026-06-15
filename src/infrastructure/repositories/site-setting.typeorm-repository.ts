import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ISiteSettingRepository,
  UpdateSiteSettingsData,
} from '@domain/site-setting/repositories/site-setting.repository.interface';
import {
  DEFAULT_SITE_SETTINGS,
  SiteSettings,
} from '@domain/site-setting/entities/site-settings.entity';
import { SiteSettingEntity } from '../database/typeorm/entities/site-setting.entity';
import { SiteSettingMapper } from '../database/typeorm/mappers/site-setting.mapper';

const SINGLETON_ID = 1;

@Injectable()
export class SiteSettingTypeOrmRepository implements ISiteSettingRepository {
  constructor(
    @InjectRepository(SiteSettingEntity)
    private readonly repository: Repository<SiteSettingEntity>,
  ) {}

  async get(): Promise<SiteSettings | null> {
    const entity = await this.repository.findOne({
      where: { id: SINGLETON_ID },
    });
    return entity ? SiteSettingMapper.toDomain(entity) : null;
  }

  async upsert(data: UpdateSiteSettingsData): Promise<SiteSettings> {
    let entity = await this.repository.findOne({
      where: { id: SINGLETON_ID },
    });

    if (!entity) {
      entity = this.repository.create({
        id: SINGLETON_ID,
        hero: { ...DEFAULT_SITE_SETTINGS.hero },
        header: {
          ...DEFAULT_SITE_SETTINGS.header,
          navLinks: [...DEFAULT_SITE_SETTINGS.header.navLinks],
        },
        footer: {
          ...DEFAULT_SITE_SETTINGS.footer,
          socialLinks: [...DEFAULT_SITE_SETTINGS.footer.socialLinks],
        },
        seo: {
          ...DEFAULT_SITE_SETTINGS.seo,
          keywords: [...DEFAULT_SITE_SETTINGS.seo.keywords],
        },
        contactInfo: { ...DEFAULT_SITE_SETTINGS.contactInfo },
      });
    }

    if (data.hero) entity.hero = { ...entity.hero, ...data.hero };
    if (data.header) entity.header = { ...entity.header, ...data.header };
    if (data.footer) entity.footer = { ...entity.footer, ...data.footer };
    if (data.seo) entity.seo = { ...entity.seo, ...data.seo };
    if (data.contactInfo) {
      entity.contactInfo = { ...entity.contactInfo, ...data.contactInfo };
    }

    const saved = await this.repository.save(entity);
    return SiteSettingMapper.toDomain(saved);
  }
}
