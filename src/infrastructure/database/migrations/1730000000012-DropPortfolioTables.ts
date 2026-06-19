import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropPortfolioTables1730000000012 implements MigrationInterface {
  name = 'DropPortfolioTables1730000000012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `pricing_feature_rows`');
    await queryRunner.query('DROP TABLE IF EXISTS `pricing_plans`');
    await queryRunner.query('DROP TABLE IF EXISTS `experiences`');
    await queryRunner.query('DROP TABLE IF EXISTS `skills`');
    await queryRunner.query('DROP TABLE IF EXISTS `projects`');
  }

  public down(_queryRunner: QueryRunner): Promise<void> {
    // Portfolio tables are not recreated on rollback — restore from v2.x backup if needed.
    return Promise.resolve();
  }
}
