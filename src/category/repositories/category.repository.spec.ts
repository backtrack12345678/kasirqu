import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepository } from './category.repository';

describe('CategoryRepository', () => {
  let provider: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryRepository],
    }).compile();

    provider = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
