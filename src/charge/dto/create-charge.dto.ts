import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateChargeDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  tax: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  fee: number;
}
