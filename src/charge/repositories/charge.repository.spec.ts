import { Test, TestingModule } from '@nestjs/testing';
import { ChargeRepository } from './charge.repository';

describe('ChargeRepository', () => {
  let provider: ChargeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChargeRepository],
    }).compile();

    provider = module.get<ChargeRepository>(ChargeRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
