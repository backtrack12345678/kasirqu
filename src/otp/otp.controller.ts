import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateOTPDto, VerifyOTPDto } from './dto/create-otp.dto';
import { OTP_TYPES } from './enum/otp.enum';
import { IWebResponse } from '../common/interfaces/web.interface';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  async createOTP(
    @Body() payload: CreateOTPDto,
  ): Promise<IWebResponse<boolean>> {
    const result = await this.otpService.createOTP(payload);
    return {
      status: 'success',
      message: result,
      data: true,
    };
  }

  @Post('verify')
  async verifyOTP(@Body() payload: VerifyOTPDto) {
    await this.otpService.verifyOTP(payload);
    const token = await this.otpService.generateTempToken(payload.phone);
    return {
      status: 'success',
      message: 'OTP Berhasil Terverifikasi',
      data: {
        token,
      },
    };
  }

  @Get()
  findAll() {
    return this.otpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload) {
    return this.otpService.update(+id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otpService.remove(+id);
  }
}
