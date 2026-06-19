import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocalizeCmsContent1730000000008 implements MigrationInterface {
  name = 'LocalizeCmsContent1730000000008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.localizeBlogPosts(queryRunner);
    await this.localizeProjects(queryRunner);
    await this.localizeSkills(queryRunner);
    await this.localizeExperiences(queryRunner);
    await this.localizePricingPlans(queryRunner);
    await this.localizePricingFeatureRows(queryRunner);
    await this.localizeSiteSettings(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.revertSiteSettings(queryRunner);
    await this.revertPricingFeatureRows(queryRunner);
    await this.revertPricingPlans(queryRunner);
    await this.revertExperiences(queryRunner);
    await this.revertSkills(queryRunner);
    await this.revertProjects(queryRunner);
    await this.revertBlogPosts(queryRunner);
  }

  private async localizeBlogPosts(queryRunner: QueryRunner): Promise<void> {
    const columns = [
      'title',
      'excerpt',
      'content',
      'author_name',
      'author_role',
    ] as const;

    for (const column of columns) {
      await queryRunner.query(`
        UPDATE blog_posts
        SET ${column} = JSON_OBJECT('en', ${column}, 'mn', ${column})
      `);
      await queryRunner.query(
        `ALTER TABLE blog_posts MODIFY ${column} JSON NOT NULL`,
      );
    }
  }

  private async revertBlogPosts(queryRunner: QueryRunner): Promise<void> {
    const specs: Array<[string, string]> = [
      ['title', 'VARCHAR(200)'],
      ['excerpt', 'VARCHAR(500)'],
      ['content', 'TEXT'],
      ['author_name', 'VARCHAR(120)'],
      ['author_role', 'VARCHAR(120)'],
    ];

    for (const [column, sqlType] of specs) {
      await queryRunner.query(`
        UPDATE blog_posts
        SET ${column} = JSON_UNQUOTE(JSON_EXTRACT(${column}, '$.en'))
      `);
      await queryRunner.query(
        `ALTER TABLE blog_posts MODIFY ${column} ${sqlType} NOT NULL`,
      );
    }
  }

  private async localizeProjects(queryRunner: QueryRunner): Promise<void> {
    for (const column of ['title', 'short_description', 'description']) {
      await queryRunner.query(`
        UPDATE projects
        SET ${column} = JSON_OBJECT('en', ${column}, 'mn', ${column})
      `);
    }

    await queryRunner.query(`ALTER TABLE projects MODIFY title JSON NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE projects MODIFY short_description JSON NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE projects MODIFY description JSON NOT NULL`,
    );
  }

  private async revertProjects(queryRunner: QueryRunner): Promise<void> {
    const specs: Array<[string, string]> = [
      ['title', 'VARCHAR(200)'],
      ['short_description', 'VARCHAR(500)'],
      ['description', 'TEXT'],
    ];

    for (const [column, sqlType] of specs) {
      await queryRunner.query(`
        UPDATE projects SET ${column} = JSON_UNQUOTE(JSON_EXTRACT(${column}, '$.en'))
      `);
      await queryRunner.query(
        `ALTER TABLE projects MODIFY ${column} ${sqlType} NOT NULL`,
      );
    }
  }

  private async localizeSkills(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE skills SET category = JSON_OBJECT('en', category, 'mn', category)
    `);
    await queryRunner.query(`ALTER TABLE skills MODIFY category JSON NOT NULL`);
  }

  private async revertSkills(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE skills SET category = JSON_UNQUOTE(JSON_EXTRACT(category, '$.en'))
    `);
    await queryRunner.query(
      `ALTER TABLE skills MODIFY category VARCHAR(100) NOT NULL`,
    );
  }

  private async localizeExperiences(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE experiences SET role = JSON_OBJECT('en', role, 'mn', role)
    `);
    await queryRunner.query(`
      UPDATE experiences
      SET location = JSON_OBJECT('en', COALESCE(location, ''), 'mn', COALESCE(location, ''))
      WHERE location IS NOT NULL
    `);
    await queryRunner.query(`
      UPDATE experiences
      SET description = JSON_OBJECT('en', COALESCE(description, ''), 'mn', COALESCE(description, ''))
      WHERE description IS NOT NULL
    `);

    await queryRunner.query(
      `ALTER TABLE experiences MODIFY role JSON NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE experiences MODIFY location JSON NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE experiences MODIFY description JSON NULL`,
    );
  }

  private async revertExperiences(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE experiences SET role = JSON_UNQUOTE(JSON_EXTRACT(role, '$.en'))
    `);
    await queryRunner.query(`
      UPDATE experiences SET location = NULLIF(JSON_UNQUOTE(JSON_EXTRACT(location, '$.en')), '')
      WHERE location IS NOT NULL
    `);
    await queryRunner.query(`
      UPDATE experiences SET description = NULLIF(JSON_UNQUOTE(JSON_EXTRACT(description, '$.en')), '')
      WHERE description IS NOT NULL
    `);

    await queryRunner.query(
      `ALTER TABLE experiences MODIFY role VARCHAR(200) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE experiences MODIFY location VARCHAR(200) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE experiences MODIFY description TEXT NULL`,
    );
  }

  private async localizePricingPlans(queryRunner: QueryRunner): Promise<void> {
    for (const column of ['name', 'description', 'price_label', 'cta_label']) {
      await queryRunner.query(`
        UPDATE pricing_plans SET ${column} = JSON_OBJECT('en', ${column}, 'mn', ${column})
      `);
    }

    await queryRunner.query(`
      UPDATE pricing_plans
      SET price_note = JSON_OBJECT('en', price_note, 'mn', price_note)
      WHERE price_note IS NOT NULL
    `);

    await queryRunner.query(`
      UPDATE pricing_plans SET features = JSON_OBJECT('en', features, 'mn', features)
    `);

    await queryRunner.query(
      `ALTER TABLE pricing_plans MODIFY name JSON NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE pricing_plans MODIFY description JSON NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE pricing_plans MODIFY price_label JSON NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE pricing_plans MODIFY price_note JSON NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE pricing_plans MODIFY cta_label JSON NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE pricing_plans MODIFY features JSON NOT NULL`,
    );
  }

  private async revertPricingPlans(queryRunner: QueryRunner): Promise<void> {
    for (const column of ['name', 'description', 'price_label', 'cta_label']) {
      await queryRunner.query(`
        UPDATE pricing_plans SET ${column} = JSON_UNQUOTE(JSON_EXTRACT(${column}, '$.en'))
      `);
    }
    await queryRunner.query(`
      UPDATE pricing_plans SET price_note = JSON_UNQUOTE(JSON_EXTRACT(price_note, '$.en'))
      WHERE price_note IS NOT NULL
    `);
    await queryRunner.query(`
      UPDATE pricing_plans SET features = JSON_EXTRACT(features, '$.en')
    `);
  }

  private async localizePricingFeatureRows(
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const column of [
      'product_name',
      'starter_value',
      'pro_value',
      'enterprise_value',
    ]) {
      await queryRunner.query(`
        UPDATE pricing_feature_rows SET ${column} = JSON_OBJECT('en', ${column}, 'mn', ${column})
      `);
      await queryRunner.query(
        `ALTER TABLE pricing_feature_rows MODIFY ${column} JSON NOT NULL`,
      );
    }
  }

  private async revertPricingFeatureRows(
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const column of [
      'product_name',
      'starter_value',
      'pro_value',
      'enterprise_value',
    ]) {
      await queryRunner.query(`
        UPDATE pricing_feature_rows SET ${column} = JSON_UNQUOTE(JSON_EXTRACT(${column}, '$.en'))
      `);
      await queryRunner.query(
        `ALTER TABLE pricing_feature_rows MODIFY ${column} VARCHAR(200) NOT NULL`,
      );
    }
  }

  private async localizeSiteSettings(queryRunner: QueryRunner): Promise<void> {
    const rows: Array<{
      id: number;
      hero: string;
      header: string;
      footer: string;
      seo: string;
      contact_info: string;
    }> = await queryRunner.query(
      `SELECT id, hero, header, footer, seo, contact_info FROM site_settings`,
    );

    for (const row of rows) {
      await queryRunner.query(
        `UPDATE site_settings SET hero = ?, header = ?, footer = ?, seo = ?, contact_info = ? WHERE id = ?`,
        [
          JSON.stringify(this.localizeSiteSettingsHero(JSON.parse(row.hero))),
          JSON.stringify(
            this.localizeSiteSettingsHeader(JSON.parse(row.header)),
          ),
          JSON.stringify(
            this.localizeSiteSettingsFooter(JSON.parse(row.footer)),
          ),
          JSON.stringify(this.localizeSiteSettingsSeo(JSON.parse(row.seo))),
          JSON.stringify(
            this.localizeSiteSettingsContact(JSON.parse(row.contact_info)),
          ),
          row.id,
        ],
      );
    }
  }

  private localizeSiteSettingsHero(hero: Record<string, unknown>) {
    return {
      title: this.toLocalized(hero.title),
      subtitle: this.toLocalized(hero.subtitle),
      description: this.toLocalized(hero.description),
      ctaLabel: this.toLocalized(hero.ctaLabel),
      ctaUrl: hero.ctaUrl ?? '/projects',
      imageUrl: hero.imageUrl ?? null,
    };
  }

  private localizeSiteSettingsHeader(header: Record<string, unknown>) {
    return {
      logoUrl: header.logoUrl ?? null,
      siteName: this.toLocalized(header.siteName),
    };
  }

  private localizeSiteSettingsFooter(footer: Record<string, unknown>) {
    return {
      copyright: this.toLocalized(footer.copyright),
      tagline: this.toLocalized(footer.tagline),
      socialLinks: footer.socialLinks ?? [],
    };
  }

  private localizeSiteSettingsSeo(seo: Record<string, unknown>) {
    const keywords = seo.keywords;
    return {
      title: this.toLocalized(seo.title),
      description: this.toLocalized(seo.description),
      ogImageUrl: seo.ogImageUrl ?? null,
      keywords: Array.isArray(keywords)
        ? { en: keywords.map(String), mn: keywords.map(String) }
        : this.toLocalizedList(keywords),
    };
  }

  private localizeSiteSettingsContact(contact: Record<string, unknown>) {
    const location = contact.location;
    return {
      email: contact.email ?? 'hello@example.com',
      phone: contact.phone ?? null,
      location:
        location === null || location === undefined
          ? null
          : this.toLocalized(location),
      showForm: contact.showForm ?? true,
    };
  }

  private toLocalized(value: unknown): { en: string; mn: string } {
    if (typeof value === 'string') {
      return { en: value, mn: value };
    }
    if (value && typeof value === 'object' && 'en' in value && 'mn' in value) {
      const record = value as Record<string, unknown>;
      return {
        en: this.coerceLocaleString(record.en),
        mn: this.coerceLocaleString(record.mn),
      };
    }
    return { en: '', mn: '' };
  }

  private coerceLocaleString(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  private toLocalizedList(value: unknown): { en: string[]; mn: string[] } {
    if (Array.isArray(value)) {
      return { en: value.map(String), mn: value.map(String) };
    }
    if (value && typeof value === 'object' && 'en' in value && 'mn' in value) {
      const record = value as Record<string, unknown>;
      return {
        en: Array.isArray(record.en) ? record.en.map(String) : [],
        mn: Array.isArray(record.mn) ? record.mn.map(String) : [],
      };
    }
    return { en: [], mn: [] };
  }

  private async revertSiteSettings(queryRunner: QueryRunner): Promise<void> {
    const rows: Array<{
      id: number;
      hero: string;
      header: string;
      footer: string;
      seo: string;
      contact_info: string;
    }> = await queryRunner.query(
      `SELECT id, hero, header, footer, seo, contact_info FROM site_settings`,
    );

    for (const row of rows) {
      const hero = JSON.parse(row.hero);
      const header = JSON.parse(row.header);
      const footer = JSON.parse(row.footer);
      const seo = JSON.parse(row.seo);
      const contact = JSON.parse(row.contact_info);

      await queryRunner.query(
        `UPDATE site_settings SET hero = ?, header = ?, footer = ?, seo = ?, contact_info = ? WHERE id = ?`,
        [
          JSON.stringify({
            title: hero.title?.en ?? hero.title,
            subtitle: hero.subtitle?.en ?? hero.subtitle,
            description: hero.description?.en ?? hero.description,
            ctaLabel: hero.ctaLabel?.en ?? hero.ctaLabel,
            ctaUrl: hero.ctaUrl,
            imageUrl: hero.imageUrl ?? null,
          }),
          JSON.stringify({
            logoUrl: header.logoUrl ?? null,
            siteName: header.siteName?.en ?? header.siteName,
            navLinks: [],
          }),
          JSON.stringify({
            copyright: footer.copyright?.en ?? footer.copyright,
            tagline: footer.tagline?.en ?? footer.tagline,
            socialLinks: footer.socialLinks ?? [],
          }),
          JSON.stringify({
            title: seo.title?.en ?? seo.title,
            description: seo.description?.en ?? seo.description,
            ogImageUrl: seo.ogImageUrl ?? null,
            keywords: seo.keywords?.en ?? seo.keywords ?? [],
          }),
          JSON.stringify({
            email: contact.email,
            phone: contact.phone ?? null,
            location: contact.location?.en ?? contact.location ?? null,
            showForm: contact.showForm ?? true,
          }),
          row.id,
        ],
      );
    }
  }
}
