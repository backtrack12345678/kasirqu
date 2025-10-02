import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsPositive,
  Matches,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nama: string;

  @IsNotEmpty()
  @Matches(/^(0|[1-9]\d{0,15})(\.\d{1,2})?$/, {
    message:
      'Harga harus berupa string angka minimal 0 dan maksimal 9999999999999999.99 (DECIMAL(18,2)). Contoh: "0", "1000", atau "9999999999999999.99"',
  })
  harga: string;

  // @IsNotEmpty()
  // @Matches(/^(0|[1-9]\d{0,15})(\.\d{1,2})?$/, {
  //   message:
  //     'Modal harus berupa string angka minimal 0 dan maksimal 9999999999999999.99 (DECIMAL(18,2)). Contoh: "0", "1000", atau "9999999999999999.99"',
  // })
  // modal: string;

  // @IsNotEmpty()
  // @IsNumber()
  // @IsPositive()
  // @Transform(({ value }) => parseInt(value, 10))
  // jumlah: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  categoryId: number;
}
