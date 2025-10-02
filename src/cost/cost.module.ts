import { Module } from '@nestjs/common';
import { CostService } from './cost.service';
import { CostController } from './cost.controller';
import { CostRepository } from './repositories/cost.repository';
import { CashBookModule } from '../cash-book/cash-book.module';

@Module({
  imports: [CashBookModule],
  controllers: [CostController],
  providers: [CostService, CostRepository],
})
export class CostModule {}
