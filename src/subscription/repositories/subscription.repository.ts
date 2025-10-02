import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionRepository {
  constructor(private prismaService: PrismaService) {}

  // async upsertSubscrption<T extends Prisma.UserSubscriptionskSelect>(
  //   userId: string,
  //   productId: string,
  //   data: Prisma.UserSubscriptionsUncheckedCreateInput,
  //   selectOptions?: T,
  // ) {
  //   return this.prismaService.userSubscriptions.upsert({
  //     where: {
  //       ownerId_productId: {
  //         ownerId: 'sdgsdg',
  //         productId: 'sdfdsf',
  //       },
  //     },
  //   });
  // }

  async createBook<T extends Prisma.CashBookSelect>(
    data: Prisma.CashBookUncheckedCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.CashBookGetPayload<{ select: T }>> {
    return this.prismaService.cashBook.create({
      data,
      select: selectOptions || undefined,
    });
  }
}
