import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMasterTripsSchema1773072105158 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS master_trips`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS master_trips CASCADE`);
  }
}
