import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBranchesTable1773078411491 implements MigrationInterface {
  name = 'UpdateBranchesTable1773078411491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Ensure the UUID extension and the custom v7 generator function exist
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION uuid_generate_v7() RETURNS uuid AS $$
        DECLARE
            v_time timestamp with time zone:= clock_timestamp();
            v_giga_ts bigint := floor(extract(epoch from v_time) * 1000);
        BEGIN
            RETURN encode(
                set_bit(
                    set_bit(
                        overlay(uuid_send(gen_random_uuid()) placing substring(decode(lpad(to_hex(v_giga_ts), 12, '0'), 'hex') from 1 for 6) from 1 for 6),
                        52, 1
                    ), 53, 1
                ), 
                'hex')::uuid;
        END;
        $$ LANGUAGE plpgsql VOLATILE;
    `);

    await queryRunner.query(`DROP INDEX "master_company"."IDX_company_name"`);
    await queryRunner.query(`DROP INDEX "master_company"."IDX_company_email"`);
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" DROP COLUMN "state"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ADD "division" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."company" ADD "owner_name" character varying(100) NOT NULL DEFAULT 'Ko Khin Maung San'`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."company" ADD "owner_phone" character varying(20) NOT NULL DEFAULT '09XXXXXXX'`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."company" ADD "owner_email" character varying(100) NOT NULL DEFAULT 'example@gmail.com'`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."refresh_tokens" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7()`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" DROP CONSTRAINT "FK_7915a0ef1701c5ee56f716f5590"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."refresh_tokens" DROP CONSTRAINT "FK_19eaf0aa60f0723c53ac9483ce1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."credentials" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."credentials" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7()`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7()`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ALTER COLUMN "gps_location" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ADD CONSTRAINT "UQ_4ed8b2f1ae869f337f817af153b" UNIQUE ("phone")`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ALTER COLUMN "status" SET DEFAULT 'Active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" DROP CONSTRAINT "FK_4e4bf5357315e806b391188d3e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."company" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."company" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7()`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" ALTER COLUMN "id" SET DEFAULT uuid_generate_v7()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_19157f3e1b0a3d26eb6f64ffbc" ON "master_company"."branches" ("branches_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5973f79e64a27c506b07cd84b2" ON "master_company"."branches" ("company_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ac817cd2d351084817d2087def" ON "master_company"."branches" ("description") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_831e30688ec18c3fe41894e6b0" ON "master_company"."company" ("company_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b0fc567cf51b1cf717a9e8046a" ON "master_company"."company" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2e71e930627351c26207d1a299" ON "master_company"."company" ("owner_email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."refresh_tokens" ADD CONSTRAINT "FK_19eaf0aa60f0723c53ac9483ce1" FOREIGN KEY ("credential_id") REFERENCES "master_company"."credentials"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ADD CONSTRAINT "FK_5973f79e64a27c506b07cd84b29" FOREIGN KEY ("company_id") REFERENCES "master_company"."company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" ADD CONSTRAINT "FK_7915a0ef1701c5ee56f716f5590" FOREIGN KEY ("credential_id") REFERENCES "master_company"."credentials"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" ADD CONSTRAINT "FK_4e4bf5357315e806b391188d3e1" FOREIGN KEY ("company_id") REFERENCES "master_company"."company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" DROP CONSTRAINT "FK_4e4bf5357315e806b391188d3e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" DROP CONSTRAINT "FK_7915a0ef1701c5ee56f716f5590"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" DROP CONSTRAINT "FK_5973f79e64a27c506b07cd84b29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."refresh_tokens" DROP CONSTRAINT "FK_19eaf0aa60f0723c53ac9483ce1"`,
    );
    await queryRunner.query(
      `DROP INDEX "master_company"."IDX_2e71e930627351c26207d1a299"`,
    );
    await queryRunner.query(
      `DROP INDEX "master_company"."IDX_b0fc567cf51b1cf717a9e8046a"`,
    );
    await queryRunner.query(
      `DROP INDEX "master_company"."IDX_831e30688ec18c3fe41894e6b0"`,
    );
    await queryRunner.query(
      `DROP INDEX "master_company"."IDX_ac817cd2d351084817d2087def"`,
    );
    await queryRunner.query(
      `DROP INDEX "master_company"."IDX_5973f79e64a27c506b07cd84b2"`,
    );
    await queryRunner.query(
      `DROP INDEX "master_company"."IDX_19157f3e1b0a3d26eb6f64ffbc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."company" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."company" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" ADD CONSTRAINT "FK_4e4bf5357315e806b391188d3e1" FOREIGN KEY ("company_id") REFERENCES "master_company"."company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" DROP CONSTRAINT "UQ_4ed8b2f1ae869f337f817af153b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ALTER COLUMN "gps_location" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."credentials" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."credentials" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."refresh_tokens" ADD CONSTRAINT "FK_19eaf0aa60f0723c53ac9483ce1" FOREIGN KEY ("credential_id") REFERENCES "master_company"."credentials"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."staff" ADD CONSTRAINT "FK_7915a0ef1701c5ee56f716f5590" FOREIGN KEY ("credential_id") REFERENCES "master_company"."credentials"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."refresh_tokens" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."company" DROP COLUMN "owner_email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."company" DROP COLUMN "owner_phone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."company" DROP COLUMN "owner_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" DROP COLUMN "division"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" ADD "state" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_company_email" ON "master_company"."company" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_company_name" ON "master_company"."company" ("company_name") `,
    );
  }
}
