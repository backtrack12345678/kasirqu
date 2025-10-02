import { Test, TestingModule } from '@nestjs/testing';
import { CostRepository } from './cost.repository';

describe('CostRepository', () => {
  let provider: CostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostRepository],
    }).compile();

    provider = module.get<CostRepository>(CostRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
