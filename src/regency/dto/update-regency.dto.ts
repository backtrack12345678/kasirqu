import { PartialType } from '@nestjs/mapped-types';
import { CreateRegencyDto } from './create-regency.dto';

export class UpdateRegencyDto extends PartialType(CreateRegencyDto) {}
