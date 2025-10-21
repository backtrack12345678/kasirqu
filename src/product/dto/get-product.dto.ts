import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class GetAllQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nama?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  categoryId?: number;
}
