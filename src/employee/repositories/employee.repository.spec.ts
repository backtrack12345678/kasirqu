import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRepository } from './employee.repository';

describe('EmployeeRepository', () => {
  let provider: EmployeeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeRepository],
    }).compile();

    provider = module.get<EmployeeRepository>(EmployeeRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
