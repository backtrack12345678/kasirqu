import { Module } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { ChargeController } from './charge.controller';
import { ChargeRepository } from './repositories/charge.repository';

@Module({
  controllers: [ChargeController],
  providers: [ChargeService, ChargeRepository],
})
export class ChargeModule {}
