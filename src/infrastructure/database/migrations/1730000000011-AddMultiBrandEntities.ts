import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMultiBrandEntities1730000000011 implements MigrationInterface {
  name = 'AddMultiBrandEntities1730000000011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`brands\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`slug\` varchar(120) NOT NULL,
        \`type\` enum('RESTAURANT','EVENT') NOT NULL,
        \`name\` json NOT NULL,
        \`description\` json NOT NULL,
        \`logo_url\` varchar(500) NULL,
        \`cover_image_url\` varchar(500) NULL,
        \`address\` json NULL,
        \`phone\` varchar(50) NULL,
        \`map_embed\` text NULL,
        \`social_links\` json NOT NULL DEFAULT ('[]'),
        \`work_hours\` json NULL,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_published\` tinyint NOT NULL DEFAULT 0,
        \`published_at\` datetime NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        UNIQUE INDEX \`UQ_brands_slug\` (\`slug\`),
        INDEX \`IDX_brands_type_published\` (\`type\`, \`is_published\`, \`sort_order\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`menu_items\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`brand_id\` int NOT NULL,
        \`category\` json NOT NULL,
        \`name\` json NOT NULL,
        \`description\` json NOT NULL,
        \`price\` decimal(10,2) NOT NULL,
        \`image_url\` varchar(500) NULL,
        \`is_available\` tinyint NOT NULL DEFAULT 1,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_published\` tinyint NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        INDEX \`IDX_menu_items_brand\` (\`brand_id\`, \`is_published\`, \`sort_order\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`brand_events\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`brand_id\` int NOT NULL,
        \`title\` json NOT NULL,
        \`description\` json NOT NULL,
        \`event_date\` datetime NOT NULL,
        \`location\` json NOT NULL,
        \`image_url\` varchar(500) NULL,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_published\` tinyint NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        INDEX \`IDX_brand_events_brand\` (\`brand_id\`, \`is_published\`, \`event_date\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`history_entries\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`year\` int NOT NULL,
        \`title\` json NOT NULL,
        \`description\` json NOT NULL,
        \`image_url\` varchar(500) NULL,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_published\` tinyint NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`leadership_members\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(120) NOT NULL,
        \`title\` json NOT NULL,
        \`quote\` json NOT NULL,
        \`image_url\` varchar(500) NULL,
        \`social_links\` json NOT NULL DEFAULT ('[]'),
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_published\` tinyint NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`team_members\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(120) NOT NULL,
        \`role\` json NOT NULL,
        \`image_url\` varchar(500) NULL,
        \`social_links\` json NOT NULL DEFAULT ('[]'),
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_published\` tinyint NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `team_members`');
    await queryRunner.query('DROP TABLE IF EXISTS `leadership_members`');
    await queryRunner.query('DROP TABLE IF EXISTS `history_entries`');
    await queryRunner.query('DROP TABLE IF EXISTS `brand_events`');
    await queryRunner.query('DROP TABLE IF EXISTS `menu_items`');
    await queryRunner.query('DROP TABLE IF EXISTS `brands`');
  }
}
