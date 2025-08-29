import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderBookService } from './order-book.service';
import { CreateOrderBookDto } from './dto/create-order-book.dto';
import { UpdateOrderBookDto } from './dto/update-order-book.dto';

@Controller('order-book')
export class OrderBookController {
  constructor(private readonly orderBookService: OrderBookService) {}

  @Post()
  create(@Body() createOrderBookDto: CreateOrderBookDto) {
    return this.orderBookService.create(createOrderBookDto);
  }

  @Get()
  findAll() {
    return this.orderBookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderBookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderBookDto: UpdateOrderBookDto) {
    return this.orderBookService.update(+id, updateOrderBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderBookService.remove(+id);
  }
}
