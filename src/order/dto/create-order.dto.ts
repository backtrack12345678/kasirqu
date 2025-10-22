import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  customer: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductsDto)
  products: OrderProductsDto[];
}

export class OrderProductsDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class OrderPaymentDto {}
