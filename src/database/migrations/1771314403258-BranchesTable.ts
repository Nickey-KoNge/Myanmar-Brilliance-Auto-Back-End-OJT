import { MigrationInterface, QueryRunner } from 'typeorm';

export class BranchesTable1771314403258 implements MigrationInterface {
  name = 'BranchesTable1771314403258';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

    await queryRunner.query(
      `CREATE TABLE "master_company"."branches" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v7(), 
        "branches_name" character varying(100) NOT NULL, 
        "company_id" uuid NOT NULL, 
        "gps_location" character varying(50), 
        "phone" character varying(20) NOT NULL, 
        "division" character varying(50) NOT NULL, 
        "city" character varying(50) NOT NULL, 
        "address" character varying(100) NOT NULL, 
        "description" character varying(255), 
        "status" character varying(20) NOT NULL DEFAULT 'Active', 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "deleted_at" TIMESTAMP, 
        CONSTRAINT "UQ_4ed8b2f1ae869f337f817af153b" UNIQUE ("phone"), 
        CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_19157f3e1b0a3d26eb6f64ffbc" ON "master_company"."branches" ("branches_name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5973f79e64a27c506b07cd84b2" ON "master_company"."branches" ("company_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" 
       ADD CONSTRAINT "FK_branches_company" 
       FOREIGN KEY ("company_id") REFERENCES "master_company"."company"("id") 
       ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "master_company"."branches" DROP CONSTRAINT "FK_branches_company"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "master_company"."branches"`);
  }
}
