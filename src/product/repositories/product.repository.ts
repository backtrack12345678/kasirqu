import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private prismaService: PrismaService) {}

  async createProduct<T extends Prisma.ProductSelect>(
    data: Prisma.ProductUncheckedCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.ProductGetPayload<{ select: T }>> {
    return this.prismaService.product.create({
      data,
      select: selectOptions || undefined,
    });
  }

  async getProducts<T extends Prisma.ProductSelect>(
    selectOptions?: T,
    whereOptions?: Prisma.ProductWhereInput,
  ): Promise<Prisma.ProductGetPayload<{ select: T }>[]> {
    return this.prismaService.product.findMany({
      select: selectOptions || undefined,
      where: whereOptions,
    });
  }
}
