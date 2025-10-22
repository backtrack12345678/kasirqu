import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CostRepository {
  constructor(private prismaService: PrismaService) {}

  async createCost<T extends Prisma.CostSelect>(
    data: Prisma.CostCreateInput,
    selectOptions?: T,
  ) {
    return this.prismaService.cost.create({
      data,
      select: selectOptions || {
        ...this.costSelectOptions,
        items: {
          select: this.costItemsSelectOptions,
        },
      },
    });
  }

  async getCosts<T extends Prisma.CostSelect>(
    whereOptions?: Prisma.CostWhereInput,
    otherOptions?,
    selectOptions?: T,
  ) {
    return this.prismaService.cost.findMany({
      select: selectOptions || {
        ...this.costSelectOptions,
        items: {
          select: this.costItemsSelectOptions,
        },
      },
      where: whereOptions,
      ...otherOptions,
    });
  }

  async getCostById<T extends Prisma.CostSelect>(
    id: string,
    selectOptions?: T,
  ) {
    return this.prismaService.cost.findUnique({
      where: {
        id,
      },
      select: selectOptions || {
        ...this.costSelectOptions,
        items: {
          select: this.costItemsSelectOptions,
        },
        book: {
          select: {
            ownerId: true,
          },
        },
      },
    });
  }

  costSelectOptions = {
    id: true,
    totalHarga: true,
    createdAt: true,
    updatedAt: true,
  };

  costItemsSelectOptions = {
    nama: true,
    harga: true,
    jumlah: true,
  };
}
