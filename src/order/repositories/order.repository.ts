import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IGetOrderOtherOptions } from '../interfaces/order.interface';

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

  async getOrders<T extends Prisma.OrderSelect>(
    selectOptions?: T,
    whereOptions?: Prisma.OrderWhereInput,
    otherOptions?: IGetOrderOtherOptions,
  ): Promise<Prisma.OrderGetPayload<{ select: T }>[]> {
    return this.prismaService.order.findMany({
      select: selectOptions || undefined,
      where: whereOptions,
      ...otherOptions,
    });
  }

  async getOrderById<T extends Prisma.OrderSelect>(
    id: string,
    selectOptions?: T,
  ): Promise<Prisma.OrderGetPayload<{ select: T }>> {
    return this.prismaService.order.findUnique({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async updateOrderById<T extends Prisma.OrderSelect>(
    id: string,
    data: Prisma.OrderUpdateInput,
    selectOptions?: T,
  ): Promise<Prisma.OrderGetPayload<{ select: T }>> {
    return this.prismaService.order.update({
      where: {
        id,
      },
      data,
      select: selectOptions || undefined,
    });
  }

  async deleteOrderById<T extends Prisma.OrderSelect>(
    id: string,
    selectOptions?: T,
  ): Promise<Prisma.OrderGetPayload<{ select: T }>> {
    return this.prismaService.order.delete({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async sumOrder(whereOptions: Prisma.OrderWhereInput) {
    return this.prismaService.order.aggregate({
      where: whereOptions,
      _sum: {
        totalHarga: true,
      },
    });
  }
}
