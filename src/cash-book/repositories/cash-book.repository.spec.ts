import { Test, TestingModule } from '@nestjs/testing';
import { CashBookRepository } from './cash-book.repository';

describe('CashBookRepository', () => {
  let provider: CashBookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashBookRepository],
    }).compile();

    provider = module.get<CashBookRepository>(CashBookRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
