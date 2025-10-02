import { Controller, Get } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Auth()
  @Get('weebhook')
  async webhook() {}
}
