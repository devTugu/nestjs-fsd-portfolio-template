import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlogAndPricing1730000000006 implements MigrationInterface {
  name = 'AddBlogAndPricing1730000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`blog_posts\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`slug\` varchar(120) NOT NULL,
        \`title\` varchar(200) NOT NULL,
        \`excerpt\` varchar(500) NOT NULL,
        \`content\` text NOT NULL,
        \`category\` enum('PRODUCT','ENGINEERING','CORPORATE','INDUSTRY') NOT NULL,
        \`author_name\` varchar(120) NOT NULL,
        \`author_role\` varchar(120) NOT NULL,
        \`cover_image_url\` varchar(500) NULL,
        \`is_published\` tinyint NOT NULL DEFAULT 0,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`published_at\` datetime(6) NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL DEFAULT NULL,
        UNIQUE KEY \`UQ_blog_posts_slug\` (\`slug\`),
        KEY \`IDX_blog_posts_category_published\` (\`category\`, \`is_published\`),
        KEY \`IDX_blog_posts_published_sort\` (\`is_published\`, \`sort_order\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`pricing_plans\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`slug\` varchar(120) NOT NULL,
        \`name\` varchar(120) NOT NULL,
        \`description\` text NOT NULL,
        \`price_label\` varchar(80) NOT NULL,
        \`price_note\` varchar(200) NULL,
        \`features\` json NOT NULL,
        \`cta_label\` varchar(80) NOT NULL,
        \`cta_url\` varchar(500) NOT NULL,
        \`is_highlighted\` tinyint NOT NULL DEFAULT 0,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_published\` tinyint NOT NULL DEFAULT 0,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL DEFAULT NULL,
        UNIQUE KEY \`UQ_pricing_plans_slug\` (\`slug\`),
        KEY \`IDX_pricing_plans_published_sort\` (\`is_published\`, \`sort_order\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`pricing_feature_rows\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`product_name\` varchar(200) NOT NULL,
        \`starter_value\` varchar(200) NOT NULL,
        \`pro_value\` varchar(200) NOT NULL,
        \`enterprise_value\` varchar(200) NOT NULL,
        \`sort_order\` int NOT NULL DEFAULT 0,
        KEY \`IDX_pricing_feature_rows_sort\` (\`sort_order\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `pricing_feature_rows`');
    await queryRunner.query('DROP TABLE `pricing_plans`');
    await queryRunner.query('DROP TABLE `blog_posts`');
  }
}
