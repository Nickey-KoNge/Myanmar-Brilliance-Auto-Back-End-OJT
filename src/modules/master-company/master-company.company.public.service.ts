//src/modules/master-company/master-company.company.public.service.ts

import { Injectable } from '@nestjs/common';
import { Company } from './company/entities/company.entity';
import { MasterCompanyCompanyService } from './company/master-company.company.service';

@Injectable()
export class MasterCompanyPublicCompanyService {
  constructor(private readonly internalService: MasterCompanyCompanyService) {}
  //single
  async getCompanyInfo(id: string): Promise<Company> {
    return this.internalService.findOne(id);
  }

  async getAllActiveCompany(): Promise<Company[]> {
    return this.internalService.findActive();
  }
  async getCompanyByIds(ids: string[]): Promise<Company[]> {
    if (!ids || ids.length === 0) return [];
    return this.internalService.findByIds(ids);
  }
}
