import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentOrderDto, UpdateOrderDto } from './dto/update-order.dto';
import { IAuth } from '../auth/interfaces/auth.interface';
import { Auth } from '../auth/decorator/auth.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { StatusResponse } from '../common/enums/web.enum';
import { GetOrdersQueryDto } from './dto/get-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth()
  @Roles(UserRole.CASHIER, UserRole.WAITER)
  @HttpCode(201)
  @Post()
  async create(@Req() request: any, @Body() payload: CreateOrderDto) {
    const auth: IAuth = request.user;
    const result = await this.orderService.create(auth, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Pesanan Berhasil Dibuat',
      data: result,
    };
  }

  @Auth()
  @Get()
  async findAll(@Req() request: any, @Query() query: GetOrdersQueryDto) {
    const auth: IAuth = request.user;
    const result = await this.orderService.findAll(auth, query);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Get(':id')
  async findOne(@Req() request: any, @Param('id') id: string) {
    const auth: IAuth = request.user;
    const result = await this.orderService.findOne(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Auth()
  @Roles(UserRole.CASHIER)
  @Patch(':id/payment')
  async payment(
    @Req() request: any,
    @Param('id') id: string,
    @Body() payload: PaymentOrderDto,
  ) {
    const auth: IAuth = request.user;
    const result = await this.orderService.payment(auth, id, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Pesanan Berhasil Dibayar',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.CASHIER, UserRole.WAITER)
  @Delete(':id')
  async remove(@Req() request: any, @Param('id') id: string) {
    const auth: IAuth = request.user;
    await this.orderService.remove(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Pesanan Berhasil Dihapus',
      data: true,
    };
  }
}
