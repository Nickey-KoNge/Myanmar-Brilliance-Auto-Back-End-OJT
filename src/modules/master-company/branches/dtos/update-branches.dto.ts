//src/modules/master-company/branches/dtos/update-branches.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchesDto } from './create-branches.dto';

export class UpdateBranchesDto extends PartialType(CreateBranchesDto) {}
