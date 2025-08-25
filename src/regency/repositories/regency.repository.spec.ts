import { Test, TestingModule } from '@nestjs/testing';
import { RegencyRepository } from './regency.repository';

describe('RegencyRepository', () => {
  let provider: RegencyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegencyRepository],
    }).compile();

    provider = module.get<RegencyRepository>(RegencyRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
