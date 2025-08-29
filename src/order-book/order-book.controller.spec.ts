import { Test, TestingModule } from '@nestjs/testing';
import { OrderBookController } from './order-book.controller';
import { OrderBookService } from './order-book.service';

describe('OrderBookController', () => {
  let controller: OrderBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderBookController],
      providers: [OrderBookService],
    }).compile();

    controller = module.get<OrderBookController>(OrderBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
