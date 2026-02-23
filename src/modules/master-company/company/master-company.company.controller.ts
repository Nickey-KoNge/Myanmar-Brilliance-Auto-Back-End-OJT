// src/modules/master-company/company/master-company.company.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MasterCompanyCompanyService } from './master-company.company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

@Controller('master-company/company')
export class MasterCompanyCompanyController {
  constructor(
    private readonly masterCompanyCompanyService: MasterCompanyCompanyService,
  ) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('lastId') lastId?: string,
    @Query('lastCreatedAt') lastCreatedAt?: string,
  ) {
    return this.masterCompanyCompanyService.findAll(
      limit,
      page,
      lastId,
      lastCreatedAt,
      search,
    );
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.masterCompanyCompanyService.create(createCompanyDto, file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterCompanyCompanyService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.masterCompanyCompanyService.update(id, updateCompanyDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterCompanyCompanyService.remove(id);
  }
}
