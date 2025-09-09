import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './repositories/order.repository';
import { ProductModule } from '../product/product.module';
import { CashBookModule } from '../cash-book/cash-book.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ProductModule, CashBookModule, UserModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
