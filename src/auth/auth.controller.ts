import { Employee } from './../../node_modules/.prisma/client/index.d';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginEmployeeDto } from './dto/create-auth.dto';
import { Request, Response } from 'express';
import { IWebResponse } from '../common/interfaces/web.interface';
import { IAuth, ILogin } from './interfaces/auth.interface';
import { Auth } from './decorator/auth.decorator';
import { StatusResponse } from '../common/enums/web.enum';
import { UserRole } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Body() payload: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IWebResponse<ILogin>> {
    const result = await this.authService.login(payload);
    response.cookie('refresh_token', result.refreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });
    return {
      status: StatusResponse.SUCCESS,
      message: 'Login Berhasil',
      data: {
        accessToken: result.accessToken,
      },
    };
  }

  @Post('employee')
  async loginEmployee(
    @Body() payload: LoginEmployeeDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.loginEmployee(payload);
    response.cookie('refresh_token', result.refreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });
    return {
      status: StatusResponse.SUCCESS,
      message: 'Login Berhasil',
      data: {
        accessToken: result.accessToken,
      },
    };
  }

  @Post('refresh-token')
  async updateAccessToken(
    @Req() request: Request,
  ): Promise<IWebResponse<ILogin>> {
    const result = await this.authService.updateAccessToken(
      request.cookies?.refresh_token,
      UserRole.OWNER,
    );
    return {
      status: StatusResponse.SUCCESS,
      message: 'Access Token Berhasil Dibuat',
      data: {
        accessToken: result,
      },
    };
  }

  @Post('refresh-token/employee')
  async updateAccessTokenEmployee(
    @Req() request: Request,
  ): Promise<IWebResponse<ILogin>> {
    const result = await this.authService.updateAccessToken(
      request.cookies?.refresh_token,
    );
    return {
      status: StatusResponse.SUCCESS,
      message: 'Access Token Berhasil Dibuat',
      data: {
        accessToken: result,
      },
    };
  }

  @Auth()
  @Delete()
  async logout(
    @Req() request: any,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IWebResponse<boolean>> {
    const auth: IAuth = request.user;
    await this.authService.logout(auth);
    response.cookie('refresh_token', '', {
      path: '/',
      httpOnly: true,
      maxAge: 0,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });
    return {
      status: StatusResponse.SUCCESS,
      message: 'Logout Berhasil',
      data: true,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
