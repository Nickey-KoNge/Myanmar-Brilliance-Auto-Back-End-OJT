//src/modules/master-company/branches/master-company.branches.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { MasterCompanyBranchesService } from './master-company.branches.service';
import { CreateBranchesDto } from './dtos/create-branches.dto';
import { UpdateBranchesDto } from './dtos/update-branches.dto';

@Controller('master-company/branches')
export class MasterCompanyBranchesController {
  constructor(
    private readonly masterCompanyBranchesService: MasterCompanyBranchesService,
  ) {}
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('lastId') lastId?: string,
    @Query('lastCreatedAt') lastCreatedAt?: string,
    @Query('companyId') companyId?: string,
  ) {
    return this.masterCompanyBranchesService.findAll(
      limit,
      page,
      lastId,
      lastCreatedAt,
      search,
      companyId,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterCompanyBranchesService.findOne(id);
  }
  @Post()
  create(@Body() createBranchesDto: CreateBranchesDto) {
    return this.masterCompanyBranchesService.create(createBranchesDto);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBranchesDto: UpdateBranchesDto,
  ) {
    return this.masterCompanyBranchesService.update(id, updateBranchesDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterCompanyBranchesService.remove(id);
  }
}
