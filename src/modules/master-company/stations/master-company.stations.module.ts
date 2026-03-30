import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stations } from "./entities/stations.entity";
import { MasterCompanyStationsController } from "./master-company.stations.controller";
import { MasterCompanyStationsService } from "./master-company.stations.service";
import { OpService } from "src/common/service/op.service";
import { ImgFileService } from "src/common/service/imgfile.service";

@Module({
    imports:[TypeOrmModule.forFeature([Stations])],
    controllers:[MasterCompanyStationsController],
    providers:[MasterCompanyStationsService,OpService,ImgFileService],
})

export class MasterCompanyStationsModule{}