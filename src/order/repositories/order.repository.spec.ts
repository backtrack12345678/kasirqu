import { Test, TestingModule } from '@nestjs/testing';
import { OrderRepository } from './order.repository';

describe('OrderRepository', () => {
  let provider: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderRepository],
    }).compile();

    provider = module.get<OrderRepository>(OrderRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
