import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderBookStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrderBookRepository {
  constructor(private prismaService: PrismaService) {}

  async getBookByOwnerIdAndStatus<T extends Prisma.OrderBookSelect>(
    ownerId: string,
    status: OrderBookStatus,
    selectOptions?: T,
  ): Promise<Prisma.OrderBookGetPayload<{ select: T }>> {
    return this.prismaService.orderBook.findFirst({
      where: {
        ownerId,
        status,
      },
      select: selectOptions || undefined,
    });
  }
}
