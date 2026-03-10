//src/modules/master-service/role/dtos/create-role.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  role_name: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}
