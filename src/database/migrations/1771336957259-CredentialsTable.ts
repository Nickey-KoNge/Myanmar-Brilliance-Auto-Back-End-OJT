import { MigrationInterface, QueryRunner } from 'typeorm';

export class CredentialsTable1771336957259 implements MigrationInterface {
  name = 'CredentialsTable1771336957259';

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
      `CREATE TABLE "master_company"."credentials" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v7(), 
        "email" character varying(150) NOT NULL, 
        "password_hash" character varying(255) NOT NULL, 
        "status" character varying(20) NOT NULL DEFAULT 'Active', 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "deleted_at" TIMESTAMP, 
        CONSTRAINT "PK_credentials_id" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_credentials_email" ON "master_company"."credentials" ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "master_company"."IDX_credentials_email"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "master_company"."credentials"`,
    );
  }
}
