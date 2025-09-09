import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsNotEmpty, Matches } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class PaymentOrderDto {
  @IsNotEmpty()
  @Matches(/^(0|[1-9]\d{0,15})(\.\d{1,2})?$/, {
    message:
      'Paid Amount harus berupa string angka minimal 0 dan maksimal 9999999999999999.99 (DECIMAL(18,2)). Contoh: "0", "1000", atau "9999999999999999.99"',
  })
  totalPaid: string;
}
