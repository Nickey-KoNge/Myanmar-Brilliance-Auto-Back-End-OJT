// src/modules/master-company/branches/master-company.branches.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    return await this.opService.create<Branches>(this.branchesRepository, dto);
  }

  async findAll(): Promise<Branches[]> {
    return await this.branchesRepository.find({
      relations: { company: true, staff: true, stations: true },
      select: {
        id: true,
        branches_name: true,
        gps_location: true,
        description: true,
        phone: true,
        city: true,
        division: true,
        status: true,
        company: {
          id: true,
          company_name: true,
        },
        staff: {
          id: true,
          staffName: true,
        },
        stations: {
          id: true,
          station_name: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<Branches> {
    const branch = await this.branchesRepository.findOne({
      where: { id },
      relations: { company: true, staff: true, stations: true },
      select: {
        id: true,
        branches_name: true,
        gps_location: true,
        description: true,
        phone: true,
        city: true,
        division: true,
        status: true,
        company: {
          id: true,
          company_name: true,
        },
        staff: {
          id: true,
          staffName: true,
        },
        stations: {
          id: true,
          station_name: true,
        },
      },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branch;
  }

  async update(id: string, dto: UpdateBranchesDto): Promise<Branches> {
    await this.findOne(id);
    await this.opService.update<Branches>(this.branchesRepository, id, dto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.findOne(id);

    try {
      await this.opService.remove<Branches>(this.branchesRepository, id);

      return { id };
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as Record<string, unknown>).code === '23503'
      ) {
        throw new BadRequestException(
          'Cannot delete this branch because it contains active staff or stations. Please remove or reassign them first.',
        );
      }

      throw error;
    }
  }
}
