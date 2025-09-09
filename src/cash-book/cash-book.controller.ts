import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  HttpCode,
} from '@nestjs/common';
import { CashBookService } from './cash-book.service';
import { CreateCashBookDto } from './dto/create-cash-book.dto';
import { UpdateOrderBookDto } from './dto/update-cash-book.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { IAuth } from '../auth/interfaces/auth.interface';
import { GetCashBooksQueryDto } from './dto/get-cash-book.dto';
import { StatusResponse } from '../common/enums/web.enum';

@Controller('cash-book')
export class CashBookController {
  constructor(private readonly cashBookService: CashBookService) {}

  @Auth()
  @Roles(UserRole.CASHIER)
  @HttpCode(201)
  @Post()
  async create(@Req() request: any, @Body() payload: CreateCashBookDto) {
    const auth: IAuth = request.user;
    const result = await this.cashBookService.create(auth, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Buku Kas Berhasil Dibuat',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.OWNER, UserRole.CASHIER)
  @Get()
  async findAll(@Req() request: any, @Query() query: GetCashBooksQueryDto) {
    const auth: IAuth = request.user;
    const result = await this.cashBookService.findAll(auth, query);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.OWNER, UserRole.CASHIER)
  @Get(':id')
  async findOne(@Req() request: any, @Param('id') id: string) {
    const auth: IAuth = request.user;
    const result = await this.cashBookService.findOne(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderBookDto: UpdateOrderBookDto,
  ) {
    return this.cashBookService.update(+id, updateOrderBookDto);
  }

  @Auth()
  @Roles(UserRole.OWNER, UserRole.CASHIER)
  @Patch('/:id/close')
  async close(@Req() request: any, @Param('id') id: string) {
    const auth: IAuth = request.user;
    const result = await this.cashBookService.close(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Buku Kas Berhasil Ditutup',
      data: result,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashBookService.remove(+id);
  }
}
