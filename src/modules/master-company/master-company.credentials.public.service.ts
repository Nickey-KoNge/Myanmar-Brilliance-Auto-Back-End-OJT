// src/modules/master-company/master-company.credentials.public.service.ts
import { Injectable } from '@nestjs/common';
import { MasterCompanyCredentialsService } from './credentials/master-company.credentials.service';
import { Credentials } from './credentials/entities/credentials.entity';

@Injectable()
export class MasterCompanyPublicCredentialsService {
  constructor(
    private readonly internalService: MasterCompanyCredentialsService,
  ) {}

  async getCredentialsInfo(id: string): Promise<Credentials> {
    return this.internalService.findOne(id);
  }

  async getCredentialsByIds(ids: string[]): Promise<Credentials[]> {
    if (!ids || ids.length === 0) return [];
    return this.internalService.findByIds(ids);
  }
}
