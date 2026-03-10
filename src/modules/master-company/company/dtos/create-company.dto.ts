//src/modules/master-company/company/dtos/create-company.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @IsNotEmpty()
  @IsString()
  reg_number: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  street_address: string;

  @IsNotEmpty()
  @IsString()
  owner_name: string;

  @IsNotEmpty()
  @IsString()
  owner_phone: string;

  @IsNotEmpty()
  @IsString()
  owner_email: string;

  @IsNotEmpty()
  @IsString()
  website_url: string;

  @IsNotEmpty()
  @IsString()
  establish_year: Date;

  @IsNotEmpty()
  @IsString()
  reg_exp_date: Date;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}
