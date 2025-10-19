import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private prismaService: PrismaService) {}

  async createProduct<T extends Prisma.ProductSelect>(
    data: Prisma.ProductUncheckedCreateInput,
    selectOptions?: T,
  ) {
    return this.prismaService.product.create({
      data,
      select: selectOptions || this.productSelectOptions,
    });
  }

  async getProducts<T extends Prisma.ProductSelect>(
    whereOptions?: Prisma.ProductWhereInput,
    selectOptions?: T,
  ) {
    return this.prismaService.product.findMany({
      select: selectOptions,
      where: whereOptions,
    });
  }

  async getProductById<T extends Prisma.ProductSelect>(
    id: string,
    selectOptions?: T,
  ) {
    return this.prismaService.product.findUnique({
      where: {
        id,
      },
      select: selectOptions || this.productSelectOptions,
    });
  }

  async updateProductById<T extends Prisma.ProductSelect>(
    id: string,
    data: Prisma.ProductUpdateInput,
    selectOptions?: T,
  ) {
    return this.prismaService.product.update({
      where: {
        id,
      },
      data,
      select: selectOptions || this.productSelectOptions,
    });
  }

  async deleteProductById<T extends Prisma.ProductSelect>(
    id: string,
    selectOptions?: T,
  ) {
    return this.prismaService.product.delete({
      where: {
        id,
      },
      select: selectOptions || this.productSelectOptions,
    });
  }

  productSelectOptions = {
    id: true,
    nama: true,
    jumlah: true,
    harga: true,
    modal: true,
    namaFile: true,
    path: true,
    owner: {
      select: {
        id: true,
        nama: true,
      },
    },
    category: {
      select: {
        id: true,
        nama: true,
      },
    },
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };
}
