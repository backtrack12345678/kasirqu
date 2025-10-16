import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Equals, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsBoolean()
  @Equals(true, { message: 'isActive harus true' })
  isActive: boolean;
}
