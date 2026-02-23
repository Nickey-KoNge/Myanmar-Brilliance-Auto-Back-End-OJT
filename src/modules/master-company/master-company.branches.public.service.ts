// src/modules/master-company/master-company.branches.public.service.ts
import { Injectable } from '@nestjs/common';
import { MasterCompanyBranchesService } from './branches/master-company.branches.service';
import { Branches } from './branches/entities/branches.entity';

@Injectable()
export class MasterCompanyPublicBranchesService {
  constructor(private readonly internalService: MasterCompanyBranchesService) {}

  async getBranchesInfo(id: string): Promise<Branches> {
    return this.internalService.findOne(id);
  }
  async getAllActiveBranches(): Promise<Branches[]> {
    return this.internalService.findActive();
  }
  async getBranchesByIds(ids: string[]): Promise<Branches[]> {
    if (!ids || ids.length === 0) return [];
    return this.internalService.findByIds(ids);
  }
}
