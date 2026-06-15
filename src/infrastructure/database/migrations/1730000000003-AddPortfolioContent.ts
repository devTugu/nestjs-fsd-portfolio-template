import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPortfolioContent1730000000003 implements MigrationInterface {
  name = 'AddPortfolioContent1730000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`projects\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`slug\` varchar(120) NOT NULL,
        \`title\` varchar(200) NOT NULL,
        \`short_description\` varchar(500) NOT NULL,
        \`description\` text NOT NULL,
        \`thumbnail_url\` varchar(500) NULL,
        \`images\` json NULL,
        \`tech_stack\` json NOT NULL,
        \`live_url\` varchar(500) NULL,
        \`repo_url\` varchar(500) NULL,
        \`is_featured\` tinyint NOT NULL DEFAULT 0,
        \`is_published\` tinyint NOT NULL DEFAULT 0,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`published_at\` datetime(6) NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL DEFAULT NULL,
        UNIQUE KEY \`UQ_projects_slug\` (\`slug\`),
        KEY \`IDX_projects_published_sort\` (\`is_published\`, \`sort_order\`),
        KEY \`IDX_projects_featured_published\` (\`is_featured\`, \`is_published\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`skills\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(100) NOT NULL,
        \`category\` varchar(50) NOT NULL,
        \`proficiency\` tinyint NOT NULL DEFAULT 3,
        \`icon\` varchar(100) NULL,
        \`is_published\` tinyint NOT NULL DEFAULT 1,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL DEFAULT NULL,
        KEY \`IDX_skills_published_sort\` (\`is_published\`, \`sort_order\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`experiences\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`company\` varchar(200) NOT NULL,
        \`role\` varchar(200) NOT NULL,
        \`location\` varchar(200) NULL,
        \`description\` text NULL,
        \`start_date\` date NOT NULL,
        \`end_date\` date NULL,
        \`is_current\` tinyint NOT NULL DEFAULT 0,
        \`is_published\` tinyint NOT NULL DEFAULT 1,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL DEFAULT NULL,
        KEY \`IDX_experiences_published_sort\` (\`is_published\`, \`sort_order\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`site_settings\` (
        \`id\` int NOT NULL,
        \`hero\` json NOT NULL,
        \`header\` json NOT NULL,
        \`footer\` json NOT NULL,
        \`seo\` json NOT NULL,
        \`contact_info\` json NOT NULL,
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`contact_messages\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(120) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`subject\` varchar(200) NULL,
        \`message\` text NOT NULL,
        \`status\` enum('NEW', 'READ', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
        \`ip_address\` varchar(45) NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        KEY \`IDX_contact_messages_status\` (\`status\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `contact_messages`');
    await queryRunner.query('DROP TABLE IF EXISTS `site_settings`');
    await queryRunner.query('DROP TABLE IF EXISTS `experiences`');
    await queryRunner.query('DROP TABLE IF EXISTS `skills`');
    await queryRunner.query('DROP TABLE IF EXISTS `projects`');
  }
}
