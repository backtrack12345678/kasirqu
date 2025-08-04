import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nama?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  kotaKabId?: number;
}
