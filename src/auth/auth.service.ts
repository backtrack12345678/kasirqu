import { Injectable } from '@nestjs/common';
import { LoginDto, LoginEmployeeDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { OtpService } from '../otp/otp.service';
import { UserService } from '../user/user.service';
import { AuthToken } from './enum/auth.enum';
import { JwtService } from '@nestjs/jwt';
import { IAuth, ILogin } from './interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { ErrorService } from '../common/error/error.service';
import { EmployeeService } from '../employee/employee.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private otpService: OtpService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private errorService: ErrorService,
    private employeeService: EmployeeService,
  ) {}

  async login(payload: LoginDto): Promise<ILogin> {
    await this.otpService.verifyOTP(payload);
    const user = await this.userService.verifyRegisteredUser(payload.phone);

    const accessToken = await this.generateAuthToken(
      user,
      AuthToken.ACCESS_TOKEN,
    );

    const refreshToken = await this.generateAuthToken(
      { id: user.id },
      AuthToken.REFRESH_TOKEN,
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

  async loginEmployee(payload: LoginEmployeeDto) {
    const employee = await this.employeeService.findOneByEmail(payload.email);

    if (!employee) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    const { password, ...employeeData } = employee;

    const isPasswordValid = await bcrypt.compare(payload.password, password);

    if (!isPasswordValid) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    // if (!isActive) {
    //   this.errorService.badRequest('Karyawan Sedang Ditangguhkan');
    // }

    const accessToken = await this.generateAuthToken(
      employeeData,
      AuthToken.ACCESS_TOKEN,
    );

    const refreshToken = await this.generateAuthToken(
      { id: employee.id },
      AuthToken.REFRESH_TOKEN,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateAccessToken(
    refreshToken: string,
    role?: UserRole,
  ): Promise<string> {
    if (!refreshToken) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    let payload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
      });
    } catch (e) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    if (role === UserRole.OWNER) {
      console.log('tes');

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

      return this.generateAuthToken(token.user, AuthToken.ACCESS_TOKEN);
    }

    const employee = await this.employeeService.findOneById(payload.id);

    if (!employee) {
      this.errorService.unauthorized('Kredensial Tidak Valid');
    }

    return this.generateAuthToken(
      {
        id: employee.id,
        nama: employee.nama,
        role: employee.role,
        ownerId: employee.ownerId,
      },
      AuthToken.ACCESS_TOKEN,
    );
  }

  async logout(auth: IAuth): Promise<boolean | void> {
    if (auth.role !== UserRole.OWNER) {
      return true;
    }

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

  async generateAuthToken(payload: IAuth, type: AuthToken) {
    const expiresIn: string =
      type === AuthToken.ACCESS_TOKEN
        ? this.configService.get<string>('ACCESS_TOKEN_AGE')
        : '30d';
    const secret: string =
      type === AuthToken.ACCESS_TOKEN
        ? this.configService.get<string>('ACCESS_TOKEN_KEY')
        : this.configService.get<string>('REFRESH_TOKEN_KEY');

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
}
