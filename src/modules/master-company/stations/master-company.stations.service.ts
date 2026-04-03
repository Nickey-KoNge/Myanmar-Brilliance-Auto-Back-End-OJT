import { InjectRepository } from "@nestjs/typeorm";
import { Repository,SelectQueryBuilder } from "typeorm";
import { Stations } from "./entities/stations.entity";
import { CreateStationsDto } from "./dtos/create-stations.dto";
import { UpdateStationsDto } from "./dtos/update-stations.dto";
import { OpService } from "../../../common/service/op.service";
import { PaginateStationsDto } from "./dtos/paginate-station.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MasterCompanyStationsService{
    constructor(
        private readonly opService:OpService,

        @InjectRepository(Stations)
        private readonly stationsRespository:Repository<Stations>,
    ){}

    async create(dto:CreateStationsDto):Promise<Stations>{
        return await this.opService.create<Stations>(this.stationsRespository,dto);
    }

 

    async findAll(query:PaginateStationsDto){
        //  return await this.stationsRespository.find();
        const {
            limit,
            page,
            lastId,
            lastCreatedAt,
            search,
            startDate,
            endDate,
            branch_id:branches_id,
        } = query;



        const queryBuilder=this.stationsRespository.createQueryBuilder('stations');

        queryBuilder.
         leftJoinAndSelect('stations.branch','branch');

        queryBuilder.addSelect(['branch.id','branch.branches_name']);

        if(branches_id){
             queryBuilder.andWhere('stations.branch = :branches_id',{branches_id});
             //queryBuilder.andWhere('stations.branches_id = :branches_id', { branches_id });
        }

        if(search){
            queryBuilder.andWhere(
                `(stations.station_name ILike :search 
                OR stations.description ILike :search 
                OR stations.phone ILike :search
                OR stations.address ILike :search
                OR stations.city ILike :search
                OR stations.division ILike :search)`,
                {search:`%${search}%`},
            );
        }

        if(startDate && endDate){
            if(startDate) queryBuilder.andWhere('stations.created_at >= :startDate',{startDate});
            if(endDate) queryBuilder.andWhere('stations.created_at <= :endDate',{endDate});
        }

        if(lastId && lastCreatedAt){
            queryBuilder.andWhere(
                '(stations.created_at < :lastCreatedAt OR (stations.created_at = :lastCreatedAt AND stations.id < :lastId))',
                { lastCreatedAt, lastId },
            );
        }else{
            const skip=(page-1)*limit;
            queryBuilder.skip(skip);
        }

        const rawData=await queryBuilder.orderBy('stations.created_at','DESC')
        .addOrderBy('stations.id','DESC')
        .take(limit)
        .getMany();


        const data=rawData.map(station=>({
            id:station.id,
            station_name:station.station_name,
            gps_location:station.gps_location,
            description:station.description,
            phone:station.phone,
            city:station.city,
            address:station.address,
            division:station.division,
            status:station.status,
            branches_id:station.branch?.id || null,
            branches_name:station.branch?.branches_name || null,
            
       
        }));

    


        const hasFilters=!!(search || startDate || endDate || branches_id);
        const total=await this.getOptimizedCount(queryBuilder,hasFilters);

        return {
            data,
            total,
            totalPages:Math.ceil(total/limit) || 1,
            currentPage:page,
        };


        
    }

    private async getOptimizedCount(
        queryBuilder: SelectQueryBuilder<Stations>,
        hasFilters:boolean,
    ): Promise<number> {
        if (hasFilters) {
            return await queryBuilder.getCount();
        }

        try {
            const result=await this.stationsRespository.query<{estimate:string}[]>(
                `
                SELECT reltuples::bigint AS estimate FROM pg_class c 
                JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE n.nspname = 'master_company' AND c.relname = 'stations';
                `
            );

            const estimate = result[0]?.estimate? Number(result[0].estimate):0;
            return estimate < 1000 ? await this.stationsRespository.count() : estimate;

            
        } catch{
            return await this.stationsRespository.count();
            
        }
        
    }
// 
    async findOne(id:string):Promise<Stations>{
        const station=await this.stationsRespository.findOne({
            where:{id},
            relations:{branch:true},
            select:{
                id:true,
                station_name:true,
                gps_location:true,
                description:true,
                phone:true,
                city:true,
                address:true,
                division:true,
                status:true,
                // branches_id:true,
                branch:{
                    id:true,
                    branches_name:true,
                }
            }
        });

        if(!station){
            throw new Error('Station not found');
        }

        return station;
    }


    async update(id:string,dto:UpdateStationsDto):Promise<Stations>{
        return await this.opService.update<Stations>(this.stationsRespository,id,dto);
    }




    async remove(id:string):Promise<{id:string}>{
        await this.findOne(id);
        try{
            await this.opService.remove<Stations>(this.stationsRespository,id);
            return {id};
        }catch(error:unknown){
            if(
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                (error as Record<string,unknown>).code === '23503'
            ){
                throw new Error('Cannot delete this station because it contains active staff. Please remove or reassign them first.');
            }
            throw error;
        }

    }


}