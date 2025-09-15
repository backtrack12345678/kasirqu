import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  IsIn,
} from 'class-validator';

export class GetOrdersQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  size?: number = 10;

  @IsOptional()
  @IsString()
  bookId: string;
}

export class GetTotalOrdersQueryDto {
  @IsOptional()
  @IsIn(['day', 'month'], { message: 'type must be either day or month' })
  type?: 'day' | 'month' = 'day'; // default day
}
