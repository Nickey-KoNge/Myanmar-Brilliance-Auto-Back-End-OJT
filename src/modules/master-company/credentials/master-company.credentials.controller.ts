//src/modules/master-company/credentials/master-company.credentials.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { MasterCompanyCredentialsService } from './master-company.credentials.service';
import { CreateCredentialsDto } from './dtos/create-credentials.dto';
import { UpdateCredentialsDto } from './dtos/update-credentials.dto';
@Controller('master-company/credentials')
export class MasterCompanyCredentialsController {
  constructor(
    private readonly masterCompanyCredentialsService: MasterCompanyCredentialsService,
  ) {}
  //   @Get()
  //   findAll(
  //     @Query('page') page?: number,
  //     @Query('limit') limit: number = 10,
  //     @Query('search') search?: string,
  //     @Query('lastId') lastId?: string,
  //     @Query('lastCreatedAt') lastCreatedAt?: string,
  //     @Query('companyId') companyId?: string,
  //   ) {
  //     return this.masterCompanyBranchesService.findAll(
  //       limit,
  //       page,
  //       lastId,
  //       lastCreatedAt,
  //       search,
  //       companyId,
  //     );
  //   }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterCompanyCredentialsService.findOne(id);
  }
  @Post()
  create(@Body() createCredentialsDto: CreateCredentialsDto) {
    return this.masterCompanyCredentialsService.create(createCredentialsDto);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCredentialsDto: UpdateCredentialsDto,
  ) {
    return this.masterCompanyCredentialsService.update(
      id,
      updateCredentialsDto,
    );
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterCompanyCredentialsService.remove(id);
  }
}
