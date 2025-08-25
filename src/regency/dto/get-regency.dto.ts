import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsPositive,
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
  cursor?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  size?: number = 5;
}
