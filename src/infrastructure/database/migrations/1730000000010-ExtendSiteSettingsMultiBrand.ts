import { MigrationInterface, QueryRunner } from 'typeorm';
import { DEFAULT_SITE_SETTINGS } from '@domain/site-setting/entities/site-settings.entity';

interface SiteSettingsRow {
  id: number;
  hero: Record<string, unknown>;
  contact_info: Record<string, unknown>;
}

export class ExtendSiteSettingsMultiBrand1730000000010 implements MigrationInterface {
  name = 'ExtendSiteSettingsMultiBrand1730000000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`site_settings\`
      ADD COLUMN \`theme\` json NOT NULL DEFAULT ('{}'),
      ADD COLUMN \`about\` json NOT NULL DEFAULT ('{}')
    `);

    const rows = (await queryRunner.query(
      'SELECT id, hero, contact_info FROM site_settings',
    )) as SiteSettingsRow[];

    for (const row of rows) {
      const hero = row.hero ?? {};
      const contactInfo = row.contact_info ?? {};

      const nextHero = {
        ...hero,
        secondaryCtaLabel:
          hero.secondaryCtaLabel ??
          DEFAULT_SITE_SETTINGS.hero.secondaryCtaLabel,
        secondaryCtaUrl:
          hero.secondaryCtaUrl ?? DEFAULT_SITE_SETTINGS.hero.secondaryCtaUrl,
      };

      const nextContactInfo = {
        ...contactInfo,
        address: contactInfo.address ?? null,
        workHours:
          contactInfo.workHours ?? DEFAULT_SITE_SETTINGS.contactInfo.workHours,
      };

      await queryRunner.query(
        'UPDATE site_settings SET hero = ?, contact_info = ?, theme = ?, about = ? WHERE id = ?',
        [
          JSON.stringify(nextHero),
          JSON.stringify(nextContactInfo),
          JSON.stringify(DEFAULT_SITE_SETTINGS.theme),
          JSON.stringify(DEFAULT_SITE_SETTINGS.about),
          row.id,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`site_settings\`
      DROP COLUMN \`theme\`,
      DROP COLUMN \`about\`
    `);
  }
}
