// src/modules/master-company/credentials/master-company.credentials.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Credentials } from './entities/credentials.entity';
import { CreateCredentialsDto } from './dtos/create-credentials.dto';
import { UpdateCredentialsDto } from './dtos/update-credentials.dto';
import { OpService } from 'src/common/service/op.service';

@Injectable()
export class MasterCompanyCredentialsService {
  constructor(
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    private readonly opService: OpService,
  ) {}

  //Basic CRUD Code

  //Create
  async create(
    createCredentialsDto: CreateCredentialsDto,
  ): Promise<Credentials> {
    return await this.opService.create<Credentials>(
      this.credentialsRepository,
      {
        ...createCredentialsDto,
      },
    );
  }
  // Read One
  async findOne(id: string): Promise<Credentials> {
    const credentials = await this.credentialsRepository.findOne({
      where: { id },
    });
    if (!credentials)
      throw new NotFoundException(`Credentials with ID ${id} not found`);
    return credentials;
  }
  //Update
  async update(
    id: string,
    updateCredentialsDto: UpdateCredentialsDto,
  ): Promise<Credentials> {
    return await this.opService.update<Credentials>(
      this.credentialsRepository,
      id,
      updateCredentialsDto,
    );
  }
  //Delete
  async remove(id: string): Promise<Credentials> {
    return await this.opService.remove<Credentials>(
      this.credentialsRepository,
      id,
    );
  }
  //Basic CRUD Code

  //N + 1 Query Problem protect
  async findByIds(ids: string[]): Promise<Credentials[]> {
    return await this.credentialsRepository.find({
      where: { id: In(ids) },
    });
  }
}
