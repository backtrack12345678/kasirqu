import { IsNotEmpty, Matches } from 'class-validator';

export class CreateCashBookDto {
  @IsNotEmpty()
  @Matches(/^(0|[1-9]\d{0,15})(\.\d{1,2})?$/, {
    message:
      'saldoTunai harus berupa string angka minimal 0 dan maksimal 9999999999999999.99 (DECIMAL(18,2)). Contoh: "0", "1000", atau "9999999999999999.99"',
  })
  saldoTunai: string;
}
