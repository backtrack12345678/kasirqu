import { Test, TestingModule } from '@nestjs/testing';
import { OrderBookRepository } from './order-book.repository';

describe('OrderBookRepository', () => {
  let provider: OrderBookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderBookRepository],
    }).compile();

    provider = module.get<OrderBookRepository>(OrderBookRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
