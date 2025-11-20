import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class QrisRepository {
  constructor(private prismaService: PrismaService) {}

  async createQris<T extends Prisma.QrisSelect>(
    data: Prisma.QrisCreateInput,
    selectOptions?: T,
  ) {
    return this.prismaService.qris.create({
      data,
      select: selectOptions || this.qrisSelectOptions,
    });
  }

  async getQriss<T extends Prisma.QrisSelect>(
    whereOptions?: Prisma.QrisWhereInput,
    selectOptions?: T,
  ) {
    return this.prismaService.qris.findMany({
      select: selectOptions || this.qrisSelectOptions,
      where: whereOptions,
    });
  }

  async getQrisById<T extends Prisma.QrisSelect>(
    id: number,
    selectOptions?: T,
  ) {
    return this.prismaService.qris.findUnique({
      where: {
        id,
      },
      select: selectOptions || this.qrisSelectOptions,
    });
  }

  async updateQrisById<T extends Prisma.QrisSelect>(
    id: number,
    data: Prisma.QrisUpdateInput,
    selectOptions?: T,
  ) {
    return this.prismaService.qris.update({
      where: {
        id,
      },
      data,
      select: selectOptions || this.qrisSelectOptions,
    });
  }

  async deleteQrisById<T extends Prisma.QrisSelect>(
    id: number,
    selectOptions?: T,
  ) {
    return this.prismaService.qris.delete({
      where: {
        id,
      },
      select: selectOptions || this.qrisSelectOptions,
    });
  }

  qrisSelectOptions = {
    id: true,
    owner: {
      select: {
        id: true,
        nama: true,
      },
    },
    namaFile: true,
    path: true,
    createdAt: true,
    updatedAt: true,
  };
}
