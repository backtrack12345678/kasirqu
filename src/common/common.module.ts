import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ErrorService } from './error/error.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import { RedisService } from './redis/redis.service';
import { ErrorFilter } from './error/error.filter';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [
    PrismaService,
    ErrorService,
    RedisService,
    {
      provide: 'APP_FILTER',
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ErrorService, RedisService],
})
export class CommonModule {}
