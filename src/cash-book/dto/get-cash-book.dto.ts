import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsPositive, IsString } from 'class-validator';

export class GetCashBooksQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  size?: number = 10;
}
