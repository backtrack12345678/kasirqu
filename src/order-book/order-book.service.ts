import { Injectable } from '@nestjs/common';
import { CreateOrderBookDto } from './dto/create-order-book.dto';
import { UpdateOrderBookDto } from './dto/update-order-book.dto';
import { OrderBookStatus } from '@prisma/client';
import { OrderBookRepository } from './repositories/order-book.repository';

@Injectable()
export class OrderBookService {
  constructor(private orderBookRepo: OrderBookRepository) {}

  create(createOrderBookDto: CreateOrderBookDto) {
    return 'This action adds a new orderBook';
  }

  findAll() {
    return `This action returns all orderBook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderBook`;
  }

  async findOneByOwnerIdAndStatus(ownerId: string, status: OrderBookStatus) {
    const book = await this.orderBookRepo.getBookByOwnerIdAndStatus(
      ownerId,
      status,
      {
        id: true,
      },
    );

    return book.id;
  }

  update(id: number, updateOrderBookDto: UpdateOrderBookDto) {
    return `This action updates a #${id} orderBook`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderBook`;
  }
}
