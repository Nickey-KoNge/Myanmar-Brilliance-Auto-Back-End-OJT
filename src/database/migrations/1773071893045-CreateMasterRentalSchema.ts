import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMasterRentalSchema1773071893045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS master_rental`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS master_rental CASCADE`);
  }
}
