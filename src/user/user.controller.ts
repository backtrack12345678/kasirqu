import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IWebResponse } from '../common/interfaces/web.interface';
import { Auth } from '../auth/decorator/auth.decorator';
import { IAuth } from '../auth/interfaces/auth.interface';
import { IOneUser, IUserResponse } from './interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() payload: CreateUserDto,
  ): Promise<IWebResponse<{ id: string }>> {
    const result = await this.userService.create(payload);
    return {
      status: 'success',
      message: 'Registrasi Pengguna Berhasil',
      data: result,
    };
  }

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Auth()
  @Get('profile')
  async findUserProfile(
    @Req() request: any,
  ): Promise<IWebResponse<IUserResponse>> {
    const auth: IAuth = request.user;
    const result: IUserResponse = await this.userService.findUserProfile(auth);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get(':userId')
  async findOne(
    @Param('userId') userId: string,
  ): Promise<IWebResponse<IOneUser>> {
    const result = await this.userService.findOne(userId);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
