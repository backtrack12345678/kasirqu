import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleInit {
  private client: Redis.Redis;
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis.Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      username: this.configService.get<string>('REDIS_USERNAME'),
      password: this.configService.get<string>('REDIS_PASSWORD'), // jika ada password
      db: this.configService.get<number>('REDIS_DB', 0),
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async set(key: string, value: string, ttlInSeconds?: number): Promise<void> {
    try {
      await (ttlInSeconds
        ? this.client.setex(key, ttlInSeconds, value)
        : this.client.set(key, value));
    } catch (error) {
      console.error(`Failed to set cache for key "${key}"`, error);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async delete(key: string): Promise<number> {
    return this.client.del(key);
  }
}
