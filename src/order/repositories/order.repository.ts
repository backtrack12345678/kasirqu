import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private prismaService: PrismaService) {}

  async createOrder<T extends Prisma.OrderSelect>(
    data: Prisma.OrderCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.OrderGetPayload<{ select: T }>> {
    return this.prismaService.order.create({
      data,
      select: selectOptions || undefined,
    });
  }
}
