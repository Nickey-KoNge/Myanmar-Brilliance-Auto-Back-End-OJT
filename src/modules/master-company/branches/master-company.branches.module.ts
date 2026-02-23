//src/modules/master-company/branches/master-company.branches.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branches } from './entities/branches.entity';
import { MasterCompanyBranchesController } from './master-company.branches.controller';
import { MasterCompanyBranchesService } from './master-company.branches.service';
import { MasterCompanyPublicBranchesService } from '../master-company.branches.public.service';

@Module({
  imports: [TypeOrmModule.forFeature([Branches])],
  providers: [MasterCompanyBranchesService, MasterCompanyPublicBranchesService],
  controllers: [MasterCompanyBranchesController],
  exports: [MasterCompanyPublicBranchesService],
})
export class MasterCompanyBranchesModule {}
