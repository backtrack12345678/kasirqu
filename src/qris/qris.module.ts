import { Module } from '@nestjs/common';
import { QrisService } from './qris.service';
import { QrisController } from './qris.controller';
import { QrisRepository } from './repositories/qris.repository';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  controllers: [QrisController],
  providers: [QrisService, QrisRepository],
})
export class QrisModule {}
