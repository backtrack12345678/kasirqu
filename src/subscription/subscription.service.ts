import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {
  async createOrRenewal(payload) {}
  async cancel(userId: string, productId: string) {}
  async webhook(payload) {}
}
