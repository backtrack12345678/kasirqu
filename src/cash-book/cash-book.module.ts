import { Module } from '@nestjs/common';
import { CashBookService } from './cash-book.service';
import { CashBookController } from './cash-book.controller';
import { CashBookRepository } from './repositories/cash-book.repository';

@Module({
  controllers: [CashBookController],
  providers: [CashBookService, CashBookRepository],
  exports: [CashBookService],
})
export class CashBookModule {}
