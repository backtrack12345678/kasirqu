import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  customer: string;

  @IsNotEmpty()
  products: {
    id: number;
    quantity: number;
  }[];
}

export class OrderPaymentDto {}
