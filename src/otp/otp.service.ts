import { Injectable } from '@nestjs/common';
import { CreateOTPDto, VerifyOTPDto } from './dto/create-otp.dto';
import { UserService } from '../user/user.service';
import { OTP_TYPES } from './enum/otp.enum';
import { generate } from 'otp-generator';
import { ErrorService } from '../common/error/error.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../common/redis/redis.service';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  constructor(
    private errorService: ErrorService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async createOTP(payload: CreateOTPDto) {
    // if (type === OTP_TYPES.REGISTER) {
    //   await this.userService.verifyUnregisteredUser(payload.phone);
    // }

    // if (type === OTP_TYPES.LOGIN) {
    //   await this.userService.verifyRegisteredUser(payload.phone);
    // }

    try {
      const { OTPNumber, expired } = this.generateOTP();

      await this.redisService.set(`OTP:${payload.phone}`, OTPNumber, expired);

      return this.sendOTP(OTPNumber, payload.phone);
    } catch (error) {
      console.log(error);
      this.errorService.internalServerError('Gagal Mengirim OTP');
    }
  }

  async verifyOTP(payload: VerifyOTPDto) {
    const otpCached = await this.redisService.get(`OTP:${payload.phone}`);

    if (!otpCached) {
      this.errorService.badRequest('OTP Tidak Valid Atau Kedaluwarsa');
    }

    if (payload.otp !== otpCached) {
      this.errorService.badRequest('OTP Tidak Valid Atau Kedaluwarsa');
    }

    await this.redisService.delete(`OTP:${payload.phone}`);
  }

  findAll() {
    return `This action returns all otp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otp`;
  }

  update(id: number, payload) {
    return `This action updates a #${id} otp`;
  }

  remove(id: number) {
    return `This action removes a #${id} otp`;
  }

  private generateOTP() {
    const OTPNumber: string = generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const expired: number = 300;

    return {
      OTPNumber,
      expired,
    };
  }

  private async sendOTP(OTPNumber: string, phone: string) {
    const options = {
      instance_key: this.configService.get<string>('OTP_INSTANCE_KEY'),
      jid: phone,
      message: `Halo! Ini adalah kode OTP Anda: *${OTPNumber}*. Berlaku selama 5 menit. Mohon jangan memberikan kode ini kepada siapa pun. Terima kasih!
        `,
    };

    const result = await axios.post(
      'https://whatsva.id/api/sendMessageText',
      options,
    );

    if (result.data.success === false) {
      console.log(result.data.message);
      this.errorService.internalServerError('OTP Gagal Dikirim');
    }

    return 'OTP Berhasil Dikirim';
  }

  async generateTempToken(phone: string): Promise<string> {
    const randomToken = crypto.randomBytes(32).toString('hex');
    const tempToken = `tmp_${randomToken}`;

    await this.redisService.set(`temp_token:${phone}`, tempToken, 1200);
    return tempToken;
  }

  async verifyTempToken(phone: string, tempToken: string): Promise<void> {
    const cachedTempToken = await this.redisService.get(`temp_token:${phone}`);

    if (!cachedTempToken) {
      this.errorService.badRequest('Token Tidak Valid Atau Kedaluwarsa');
    }

    if (tempToken !== cachedTempToken) {
      this.errorService.badRequest('Token Tidak Valid Atau Kedaluwarsa');
    }

    await this.redisService.delete(`temp_token:${phone}`);
  }
}
