//src/modules/master-company/staff/dtos/create-staff.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  staffName: string;

  @IsNotEmpty()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  position?: string;

  @IsNotEmpty()
  @IsString()
  status?: string;

  @IsNotEmpty()
  @IsString()
  credential: string;

  @IsNotEmpty()
  @IsString()
  company: string;
}
