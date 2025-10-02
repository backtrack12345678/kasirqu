import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionRepository } from './subscription.repository';

describe('SubscriptionRepository', () => {
  let provider: SubscriptionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionRepository],
    }).compile();

    provider = module.get<SubscriptionRepository>(SubscriptionRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
