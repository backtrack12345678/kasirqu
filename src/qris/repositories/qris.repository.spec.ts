import { Test, TestingModule } from '@nestjs/testing';
import { QrisRepository } from './qris.repository';

describe('QrisRepository', () => {
  let provider: QrisRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QrisRepository],
    }).compile();

    provider = module.get<QrisRepository>(QrisRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
