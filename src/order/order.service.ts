import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderBookService } from '../order-book/order-book.service';
import { IAuth } from '../auth/interfaces/auth.interface';
import { OrderBookStatus } from '@prisma/client';
import { OrderRepository } from './repositories/order.repository';
import { ErrorService } from '../common/error/error.service';
import { v4 as uuid } from 'uuid';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    private orderBookService: OrderBookService,
    private orderRepo: OrderRepository,
    private errorService: ErrorService,
    private productService: ProductService,
  ) {}

  async create(auth: IAuth, payload: CreateOrderDto) {
    const ownerId = auth.id;
    // const { products, ...orderPayload } = payload;

    // const ids = products.map((p) => p.id);

    // if (new Set(ids).size !== ids.length) {
    //   this.errorService.badRequest('id product ada yang duplikat');
    // }

    // const orderBook = this.orderBookService.findOneByOwnerIdAndStatus(
    //   ownerId,
    //   OrderBookStatus.BUKA,
    // );

    // const id = `user-${uuid().toString()}`;

    // const order = await this.orderRepo.createOrder({
    //   id,
    //   ...orderPayload,
    //   products : {
    //     createMany:
    //   }
    // });
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
