//src/modules/master-company/company/master-company.company.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { MasterCompanyCompanyService } from './master-company.company.service';
import { MasterCompanyCompanyController } from './master-company.company.controller';
import { MasterCompanyPublicCompanyService } from '../master-company.company.public.service';

import { FileServiceProvider } from 'src/common/service/file.service';
import { OptimizeImageService } from 'src/common/service/optimize-image.service';
@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [
    MasterCompanyCompanyService,
    MasterCompanyPublicCompanyService,
    FileServiceProvider,
    OptimizeImageService,
  ],
  controllers: [MasterCompanyCompanyController],
})
export class MasterCompanyCompanyModule {}
