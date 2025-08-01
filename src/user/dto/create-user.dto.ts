import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @Matches(/^[0-9]+$/, { message: 'phone must be digit' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nama: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  kotaKabId: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsIn([true], { message: 'Accept term must be true' })
  acceptTerm: boolean;

  @IsNotEmpty()
  @IsString()
  token: string;
}
