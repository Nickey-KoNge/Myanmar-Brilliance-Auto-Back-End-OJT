import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMasterServiceSchema1771242810509 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS master_service`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS master_service CASCADE`);
  }
}
