// src/modules/master-company/company/master-company.company.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

// import * as bcrypt from 'bcrypt';

import { OpService } from 'src/common/service/op.service';
// import { ImgFileService } from 'src/common/service/imgfile.service';
import { IFileService } from 'src/common/service/i-file.service';
import { OptimizeImageService } from 'src/common/service/optimize-image.service';

@Injectable()
export class MasterCompanyCompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @Inject(IFileService)
    private readonly fileService: IFileService,
    private readonly opService: OpService,
    private readonly optimizeImageService: OptimizeImageService,
  ) {}

  async findActive(): Promise<Company[]> {
    return await this.companyRepository.find({
      where: { status: ILike('Active') },
      select: ['id', 'company_name'],
    });
  }

  // N+1 Query Problem protect (get sale record from db and branch also call same like sale record from db)
  async findByIds(ids: string[]): Promise<Company[]> {
    return await this.companyRepository.find({
      where: { id: In(ids) },
    });
  }

  // Read One
  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['branches'],
    });
    if (!company)
      throw new NotFoundException(`Company with ID ${id} not found`);
    return company;
  }

  async create(
    createCompanyDto: CreateCompanyDto,
    file: Express.Multer.File,
  ): Promise<Company> {
    if (!file) throw new Error('No file uploaded');
    const optimizedFile = await this.optimizeImageService.optimizeImage(file);
    const imageUrl = await this.fileService.uploadFile(
      optimizedFile,
      'company',
    );

    return await this.opService.create<Company>(this.companyRepository, {
      ...createCompanyDto,
      image: imageUrl,
    });
  }

  async findAll(
    limit: number = 10,
    page: number = 1,
    lastId?: string,
    lastCreatedAt?: string,
    search?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const queryBuilder = this.companyRepository.createQueryBuilder('company');

    // ------ Searching Filter -----
    if (search) {
      queryBuilder.andWhere(
        `(company.company_name ILike :search 
            OR company.street_address ILike :search 
            OR company.email ILike :search 
            OR company.phone ILike :search 
            OR company.reg_number ILike :search)`,
        { search: `%${search}%` },
      );
    }

    // --- Date Range Filter ---
    if (startDate && endDate) {
      queryBuilder.andWhere(
        'company.created_at BETWEEN :startDate AND :endDate',
        {
          startDate: `${startDate} 00:00:00`,
          endDate: `${endDate} 23:59:59`,
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('company.created_at >= :startDate', {
        startDate: `${startDate} 00:00:00`,
      });
    } else if (endDate) {
      queryBuilder.andWhere('company.created_at <= :endDate', {
        endDate: `${endDate} 23:59:59`,
      });
    }
    // ------ Pagination Logic --------
    if (lastId && lastCreatedAt && lastId !== 'undefined' && lastId !== '') {
      queryBuilder.andWhere(
        '(company.created_at < :lastCreatedAt OR (company.created_at = :lastCreatedAt AND company.id < :lastId))',
        { lastCreatedAt, lastId },
      );
    } else {
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip);
    }

    const data = await queryBuilder
      .orderBy('company.created_at', 'DESC')
      .addOrderBy('company.id', 'DESC')
      .take(limit)
      .getMany();

    // -------- Total count Logic -------

    let total: number;
    if (search) {
      total = await queryBuilder.getCount();
    } else {
      total = await this.companyRepository.count();
      if (total > 100) {
        const result = await this.companyRepository.query<
          { estimate: string }[]
        >(
          `SELECT reltuples::bigint AS estimate 
          FROM pg_class c 
          JOIN pg_namespace n ON n.oid = c.relnamespace 
          WHERE n.nspname = 'master_company' 
          AND c.relname = 'company'`,
        );
        total = result && result.length > 0 ? Number(result[0].estimate) : 0;
      }
    }

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  // Update
  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    file?: Express.Multer.File,
  ): Promise<Company> {
    const dto = updateCompanyDto || ({} as UpdateCompanyDto);
    if (Object.keys(dto).length === 0 && !file) {
      throw new Error('No data provided for update');
    }

    if (file) {
      const existingCompany = await this.findOne(id);
      if (existingCompany.image) {
        await this.fileService.deleteFile(existingCompany.image);
      }
      const optimizedFile = await this.optimizeImageService.optimizeImage(file);
      const newImageUrl = await this.fileService.uploadFile(
        optimizedFile,
        'company',
      );
      dto.image = newImageUrl;
    }

    return await this.opService.update<Company>(
      this.companyRepository,
      id,
      dto,
    );
  }
  // Delete
  async remove(id: string): Promise<Company> {
    const existingCompany = await this.findOne(id);
    if (existingCompany && existingCompany.image) {
      await this.fileService.deleteFile(existingCompany.image);
    }
    return await this.opService.remove<Company>(this.companyRepository, id);
  }

  //Basic CRUD Code
}
