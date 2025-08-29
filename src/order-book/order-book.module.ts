import { Module } from '@nestjs/common';
import { OrderBookService } from './order-book.service';
import { OrderBookController } from './order-book.controller';
import { OrderBookRepository } from './repositories/order-book.repository';

@Module({
  controllers: [OrderBookController],
  providers: [OrderBookService, OrderBookRepository],
  exports: [OrderBookService],
})
export class OrderBookModule {}
