// src/modules/master-company/credentials/entities/credentials.entity.ts
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ schema: 'master_company', name: 'credentials' })
export class Credentials {
  @PrimaryColumn({
    type: 'uuid',
    default: () => 'uuid_generate_v7()',
  })
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 20, default: 'Active' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
