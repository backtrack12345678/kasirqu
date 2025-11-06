import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ChargeService } from './charge.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { StatusResponse } from '../common/enums/web.enum';
import { IAuth } from '../auth/interfaces/auth.interface';

@Controller('charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}

  @Auth()
  @Roles(UserRole.OWNER)
  @Post()
  async create(@Req() request: any, @Body() payload: CreateChargeDto) {
    const auth: IAuth = request.user;
    const result = await this.chargeService.create(auth, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Biaya Berhasil Dibuat',
      data: result,
    };
  }

  @Auth()
  @Get()
  async findAll(@Req() request: any) {
    const auth: IAuth = request.user;
    const result = await this.chargeService.findAll(auth);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Get(':id')
  async findOne(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
    const auth: IAuth = request.user;
    const result = await this.chargeService.findOne(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.OWNER)
  @Patch(':id')
  async update(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateChargeDto,
  ) {
    const auth: IAuth = request.user;
    const result = await this.chargeService.update(auth, id, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Biaya Berhasil Diperbarui',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.OWNER)
  @Delete(':id')
  async remove(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
    const auth: IAuth = request.user;
    const result = await this.chargeService.remove(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Biaya Berhasil Dihapus',
      data: result,
    };
  }
}
