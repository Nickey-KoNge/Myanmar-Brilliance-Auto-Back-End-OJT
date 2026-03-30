import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { MasterCompanyStationsService } from "./master-company.stations.service";
import { CreateStationsDto } from "./dtos/create-stations.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";
import { GetStationsSerialize } from "../stations/serialize/get-stations.serialize";
import { UpdateStationsDto } from "./dtos/update-stations.dto";
import { PaginateStationsDto } from "./dtos/paginate-station.dto";
import { FindStationsSerialize } from "./serialize/find-stations.serialize";

@Controller('master-company/stations')

export class MasterCompanyStationsController{
    constructor(private readonly service:MasterCompanyStationsService){}



    @Post()
    async create(@Body() dto:CreateStationsDto){
        return await this.service.create(dto);
    }

    @Serialize(FindStationsSerialize)
    @Get()
    async findAll(@Query() query:PaginateStationsDto){
        return await this.service.findAll(query);
    }

    @Get(':id')
    @Serialize(GetStationsSerialize)
    async findOne(@Param('id') id: string) {
        return await this.service.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id:string, @Body() dto:UpdateStationsDto){
        return await this.service.update(id,dto);
    }


    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.service.remove(id);
    }

}