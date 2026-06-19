import { MigrationInterface, QueryRunner } from 'typeorm';

interface SiteSettingsHeaderJson {
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  adminLogoUrl?: string | null;
  faviconUrl?: string | null;
  siteName?: unknown;
}

interface SiteSettingsRow {
  id: number;
  header: SiteSettingsHeaderJson;
}

export class ExtendSiteSettingsBranding1730000000009 implements MigrationInterface {
  name = 'ExtendSiteSettingsBranding1730000000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const rows = (await queryRunner.query(
      'SELECT id, header FROM site_settings',
    )) as SiteSettingsRow[];

    for (const row of rows) {
      const header = row.header ?? {};
      const nextHeader = {
        logoUrl: header.logoUrl ?? null,
        logoDarkUrl: header.logoDarkUrl ?? null,
        adminLogoUrl: header.adminLogoUrl ?? null,
        faviconUrl: header.faviconUrl ?? null,
        siteName: header.siteName ?? { en: 'Your Site', mn: 'Таны сайт' },
      };

      await queryRunner.query(
        'UPDATE site_settings SET header = ? WHERE id = ?',
        [JSON.stringify(nextHeader), row.id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const rows = (await queryRunner.query(
      'SELECT id, header FROM site_settings',
    )) as SiteSettingsRow[];

    for (const row of rows) {
      const header = row.header ?? {};
      const { logoDarkUrl, adminLogoUrl, faviconUrl, ...rest } = header;
      void logoDarkUrl;
      void adminLogoUrl;
      void faviconUrl;

      await queryRunner.query(
        'UPDATE site_settings SET header = ? WHERE id = ?',
        [JSON.stringify(rest), row.id],
      );
    }
  }
}
