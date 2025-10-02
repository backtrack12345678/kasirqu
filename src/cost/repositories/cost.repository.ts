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
        ...this.toCostSelectOptions,
        items: {
          select: this.toCostItemsSelectOptions,
        },
      },
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
        ...this.toCostSelectOptions,
        items: {
          select: this.toCostItemsSelectOptions,
        },
        book: {
          select: {
            ownerId: true,
          },
        },
      },
    });
  }

  toCostSelectOptions = {
    id: true,
    totalHarga: true,
    createdAt: true,
    updatedAt: true,
  };

  toCostItemsSelectOptions = {
    nama: true,
    harga: true,
    jumlah: true,
  };
}
