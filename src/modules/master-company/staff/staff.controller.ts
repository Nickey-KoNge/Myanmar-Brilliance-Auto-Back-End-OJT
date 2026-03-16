import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AtGuard } from '../../../common/guards/at.guard';

//extra import for serialize
import { FindStaffSerialize } from './serialize/find-staff.serialize';
import { plainToInstance } from 'class-transformer';
import { PaginateStaffDto } from './dto/paginate-staff.dto';

@Controller('master-company/staff')
@UseGuards(AtGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createStaffDto: CreateStaffDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.staffService.create(createStaffDto, file);
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Query() query: PaginateStaffDto) {
    const result = await this.staffService.findAll(query);
    const serializedData = plainToInstance(FindStaffSerialize, result.data, {
      excludeExtraneousValues: true,
    });
    return {
      ...result,
      data: serializedData,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.staffService.update(id, updateStaffDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
