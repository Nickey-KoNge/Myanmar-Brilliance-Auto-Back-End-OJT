import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VehicleBrandsService } from './vehicle-brands.service';
import { CreateVehicleBrandsDto } from './dtos/create-vehicle-brands.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateVehicleBrandsDto } from './dtos/update-vehicle-brands.dto';

@Controller('master-vehicle/vehicle-brands')
export class VehicleBrandsController {
  constructor(private readonly vehicleBrandsService: VehicleBrandsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createVehicleBrandDto: CreateVehicleBrandsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.vehicleBrandsService.create(createVehicleBrandDto, file);
  }

  @Get()
  findAll() {
    return this.vehicleBrandsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vehicleBrandsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body()
    updateVehicleBrandsDto: UpdateVehicleBrandsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.vehicleBrandsService.update(
      id,
      updateVehicleBrandsDto,
      file,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleBrandsService.remove(id);
  }
}
