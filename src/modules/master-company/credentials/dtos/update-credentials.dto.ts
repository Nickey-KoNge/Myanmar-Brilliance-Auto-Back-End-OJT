//src/modules/master-company/credentials/dtos/update-credentials.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCredentialsDto } from './create-credentials.dto';

export class UpdateCredentialsDto extends PartialType(CreateCredentialsDto) {}
