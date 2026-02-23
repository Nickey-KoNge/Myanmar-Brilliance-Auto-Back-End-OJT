//src/app.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

import { MasterCompanyCompanyModule } from './modules/master-company/company/master-company.company.module';
import { MasterServiceRoleModule } from './modules/master-service/role/master-service.role.module';
import { MasterCompanyBranchesModule } from './modules/master-company/branches/master-company.branches.module';
import { MasterCompanyCredentialsModule } from './modules/master-company/credentials/master-company.credentials.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    MasterCompanyCompanyModule,
    MasterServiceRoleModule,
    MasterCompanyBranchesModule,
    MasterCompanyCredentialsModule,
    CommonModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
  ],
})
export class AppModule {}
