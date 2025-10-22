import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class GetCashBooksQueryDto {
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
  @Matches(/^\d{4}-\d{2}$/, { message: 'Format bulan harus YYYY-MM' }) // Validasi format YYYY-MM
  month?: string = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  })();
}
