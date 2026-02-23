// src/modules/master-company/branches/master-company.branches.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { Branches } from './entities/branches.entity';
import { CreateBranchesDto } from './dtos/create-branches.dto';
import { UpdateBranchesDto } from './dtos/update-branches.dto';
import { OpService } from 'src/common/service/op.service';

@Injectable()
export class MasterCompanyBranchesService {
  constructor(
    @InjectRepository(Branches)
    private readonly branchesRepository: Repository<Branches>,
    private readonly opService: OpService,
  ) {}

  //Basic CRUD Code

  async findAll(
    limit: number = 10,
    page?: number,
    lastId?: string,
    lastCreatedAt?: string,
    search?: string,
    companyId?: string,
  ) {
    const queryBuilder = this.branchesRepository.createQueryBuilder('branches');
    if (companyId) {
      queryBuilder.andWhere('branches.company_id = :companyId', { companyId });
    }
    if (search) {
      queryBuilder.andWhere(
        `(branches.branches_name ILike :search 
      OR branches.phone ILike :search 
      OR branches.city ILike :search)`,
        { search: `%${search}%` },
      );
    }

    if (lastId && lastCreatedAt) {
      queryBuilder.andWhere(
        '(branches.created_at < :lastCreatedAt OR (branches.created_at = :lastCreatedAt AND branches.id < :lastId))',
        { lastCreatedAt, lastId },
      );
    } else if (page && page > 1) {
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip);
    }

    const data = await queryBuilder
      .orderBy('branches.created_at', 'DESC')
      .addOrderBy('branches.id', 'DESC')
      .take(limit)
      .getMany();

    let total: number;
    if (search) {
      total = await queryBuilder.getCount();
    } else {
      const result = await this.branchesRepository.query<
        { estimate: string }[]
      >(
        `SELECT reltuples::bigint AS estimate 
          FROM pg_class c 
          JOIN pg_namespace n ON n.oid = c.relnamespace 
          WHERE n.nspname = 'master_company' AND c.relname = 'branches'`,
      );
      total = result && result.length > 0 ? Number(result[0].estimate) : 0;
    }

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  //Create
  async create(createBranchesDto: CreateBranchesDto): Promise<Branches> {
    return await this.opService.create<Branches>(this.branchesRepository, {
      ...createBranchesDto,
    });
  }
  // Read One
  async findOne(id: string): Promise<Branches> {
    const branches = await this.branchesRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!branches)
      throw new NotFoundException(`Branches with ID ${id} not found`);
    return branches;
  }
  //Update
  async update(
    id: string,
    updateBranchesDto: UpdateBranchesDto,
  ): Promise<Branches> {
    return await this.opService.update<Branches>(
      this.branchesRepository,
      id,
      updateBranchesDto,
    );
  }
  //Delete
  async remove(id: string): Promise<Branches> {
    return await this.opService.remove<Branches>(this.branchesRepository, id);
  }
  //Basic CRUD Code

  //Filter data (Only Active Record)
  async findActive(): Promise<Branches[]> {
    return await this.branchesRepository.find({
      where: { status: ILike('Active') },
      select: ['id', 'branches_name'],
    });
  }
  //N + 1 Query Problem protect
  async findByIds(ids: string[]): Promise<Branches[]> {
    return await this.branchesRepository.find({
      where: { id: In(ids) },
    });
  }
}
