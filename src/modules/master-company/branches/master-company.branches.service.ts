// src/modules/master-company/branches/master-company.branches.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branches } from './entities/branches.entity';
// import { Create } from 'sharp';
import { CreateBranchesDto } from './dtos/create-branches.dto';
import { UpdateBranchesDto } from './dtos/update-branches.dto';
import { OpService } from '../../../common/service/op.service';

@Injectable()
export class MasterCompanyBranchesService {
  constructor(
    private readonly opService: OpService,

    @InjectRepository(Branches)
    private readonly branchesRepository: Repository<Branches>,
  ) {}

  async create(dto: CreateBranchesDto): Promise<Branches> {
    // const branch=this.branchesRepository.create(dto);
    // return await this.branchesRepository.save(branch);
    return await this.opService.create<Branches>(this.branchesRepository, dto);
  }

  async findAll(): Promise<Branches[]> {
    return await this.branchesRepository.find();
  }

  async findOne(id: string): Promise<Branches> {
    const branch = await this.branchesRepository.findOne({ where: { id } });
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branch;
  }

  async update(id: string, dto: UpdateBranchesDto): Promise<Branches> {
    await this.findOne(id);
    await this.branchesRepository.update(id, dto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<Branches> {
    const branch = await this.findOne(id);
    return await this.branchesRepository.remove(branch);
  }
}
