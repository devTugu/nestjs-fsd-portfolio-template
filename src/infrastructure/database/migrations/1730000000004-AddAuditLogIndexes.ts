import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuditLogIndexes1730000000004 implements MigrationInterface {
  name = 'AddAuditLogIndexes1730000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX `IDX_audit_created_at` ON `audit_logs` (`created_at`)',
    );
    await queryRunner.query(
      'CREATE INDEX `IDX_audit_resource` ON `audit_logs` (`resource`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `IDX_audit_resource` ON `audit_logs`');
    await queryRunner.query(
      'DROP INDEX `IDX_audit_created_at` ON `audit_logs`',
    );
  }
}
