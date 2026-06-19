import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdentityFields1730000000005 implements MigrationInterface {
  name = 'AddIdentityFields1730000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` MODIFY `password_hash` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `oauth_provider` varchar(50) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `oauth_subject` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `mfa_enabled` tinyint NOT NULL DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD `mfa_secret_encrypted` text NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `UQ_users_oauth` ON `users` (`oauth_provider`, `oauth_subject`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `UQ_users_oauth` ON `users`');
    await queryRunner.query(
      'ALTER TABLE `users` DROP COLUMN `mfa_secret_encrypted`',
    );
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `mfa_enabled`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `oauth_subject`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `oauth_provider`');
    await queryRunner.query(
      'ALTER TABLE `users` MODIFY `password_hash` varchar(255) NOT NULL',
    );
  }
}
