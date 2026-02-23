//src/modules/master-company/credentials/master-company.credentials.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credentials } from './entities/credentials.entity';
import { MasterCompanyCredentialsController } from './master-company.credentials.controller';
import { MasterCompanyCredentialsService } from './master-company.credentials.service';
import { MasterCompanyPublicCredentialsService } from '../master-company.credentials.public.service';

@Module({
  imports: [TypeOrmModule.forFeature([Credentials])],
  providers: [
    MasterCompanyCredentialsService,
    MasterCompanyPublicCredentialsService,
  ],
  controllers: [MasterCompanyCredentialsController],
  exports: [MasterCompanyPublicCredentialsService],
})
export class MasterCompanyCredentialsModule {}
