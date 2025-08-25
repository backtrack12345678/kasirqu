import { Module } from '@nestjs/common';
import { RegencyService } from './regency.service';
import { RegencyController } from './regency.controller';
import { RegencyRepository } from './repositories/regency.repository';

@Module({
  controllers: [RegencyController],
  providers: [RegencyService, RegencyRepository],
})
export class RegencyModule {}
