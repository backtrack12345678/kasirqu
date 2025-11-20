import { PartialType } from '@nestjs/mapped-types';
import { CreateQriDto } from './create-qri.dto';

export class UpdateQriDto extends PartialType(CreateQriDto) {}
