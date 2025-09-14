import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VerifyOTPDto } from '../../otp/dto/create-otp.dto';
import { Transform } from 'class-transformer';

export class LoginDto extends VerifyOTPDto {}

export class LoginEmployeeDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  password: string;
}
