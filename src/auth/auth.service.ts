import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { OtpService } from '../otp/otp.service';
import { UserService } from '../user/user.service';
import { AUTH_TOKEN } from './enum/auth.enum';
import { JwtService } from '@nestjs/jwt';
import { IAuth, ILogin } from './interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { ErrorService } from '../common/error/error.service';

@Injectable()
export class AuthService {
  constructor(
    private otpService: OtpService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private errorService: ErrorService,
  ) {}

  async login(payload: LoginDto): Promise<ILogin> {
    await this.otpService.verifyOTP(payload);
    const user = await this.userService.verifyRegisteredUser(payload.phone);

    const accessToken = await this.generateAuthToken(
      user,
      AUTH_TOKEN.ACCESS_TOKEN,
    );

    const refreshToken = await this.generateAuthToken(
      { id: user.id },
      AUTH_TOKEN.REFRESH_TOKEN,
    );

    await this.prismaService.refresh_Token.upsert({
      where: {
        userId: user.id,
      },
      update: {
        refreshToken,
      },
      create: {
        userId: user.id,
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateAccessToken(refreshToken: string): Promise<string> {
    if (!refreshToken) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
      });
    } catch (e) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    const token = await this.prismaService.refresh_Token.findFirst({
      where: {
        refreshToken,
      },
      select: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!token) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    return this.generateAuthToken(token.user, AUTH_TOKEN.ACCESS_TOKEN);
  }

  async logout(auth: IAuth): Promise<void> {
    await this.prismaService.refresh_Token.delete({
      where: {
        userId: auth.id,
      },
      select: {
        id: true,
      },
    });
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async generateAuthToken(payload: IAuth, type: AUTH_TOKEN) {
    const expiresIn: string =
      type === AUTH_TOKEN.ACCESS_TOKEN
        ? this.configService.get<string>('ACCESS_TOKEN_AGE')
        : '30d';
    const secret: string =
      type === AUTH_TOKEN.ACCESS_TOKEN
        ? this.configService.get<string>('ACCESS_TOKEN_KEY')
        : this.configService.get<string>('REFRESH_TOKEN_KEY');

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
}
