import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNavigationNodes1730000000007 implements MigrationInterface {
  name = 'AddNavigationNodes1730000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`navigation_nodes\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`scope\` enum('HEADER','FOOTER') NOT NULL,
        \`parent_id\` int NULL,
        \`type\` enum('MEGA','COLUMN','LINK','SIDEBAR','PROMO','CTA_ROW','GROUP') NOT NULL,
        \`labels\` json NOT NULL,
        \`descriptions\` json NULL,
        \`href\` varchar(500) NULL,
        \`icon\` varchar(80) NULL,
        \`metadata\` json NULL,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`is_published\` tinyint NOT NULL DEFAULT 0,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL DEFAULT NULL,
        KEY \`IDX_navigation_nodes_scope_parent_sort\` (\`scope\`, \`parent_id\`, \`sort_order\`),
        KEY \`IDX_navigation_nodes_published\` (\`is_published\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `navigation_nodes`');
  }
}
