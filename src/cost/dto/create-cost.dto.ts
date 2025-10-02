import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  Matches,
} from 'class-validator';

class CostItemDto {
  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsNumber()
  jumlah: number;

  @IsNotEmpty()
  @Matches(/^(0|[1-9]\d{0,15})(\.\d{1,2})?$/, {
    message:
      'harga harus berupa string angka minimal 0 dan maksimal 9999999999999999.99 (DECIMAL(18,2)). Contoh: "0", "1000", atau "9999999999999999.99"',
  })
  harga: string;
}

export class CreateCostDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CostItemDto)
  items: CostItemDto[];
}
