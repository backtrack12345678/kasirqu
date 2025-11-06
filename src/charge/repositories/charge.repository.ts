import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChargeRepository {
  constructor(private prismaService: PrismaService) {}

  async createCharge<T extends Prisma.ChargeSelect>(
    data: Prisma.ChargeUncheckedCreateInput,
    selectOptions?: T,
  ) {
    return this.prismaService.charge.create({
      data,
      select: selectOptions || this.chargeSelectOptions,
    });
  }

  async getChargeByOwnerId<T extends Prisma.ChargeSelect>(
    ownerId: string,
    selectOptions?: T,
  ) {
    return this.prismaService.charge.findMany({
      where: {
        ownerId,
      },
      select: selectOptions || this.chargeSelectOptions,
    });
  }

  async getChargeById<T extends Prisma.ChargeSelect>(
    id: number,
    selectOptions?: T,
  ) {
    return this.prismaService.charge.findUnique({
      where: {
        id,
      },
      select: selectOptions || this.chargeSelectOptions,
    });
  }

  async updateChargeById<T extends Prisma.ChargeSelect>(
    id: number,
    data: Prisma.ChargeUpdateInput,
    selectOptions?: T,
  ) {
    return this.prismaService.charge.update({
      where: {
        id,
      },
      data,
      select: selectOptions || this.chargeSelectOptions,
    });
  }

  async deleteChargeById<T extends Prisma.ChargeSelect>(
    id: number,
    selectOptions?: T,
  ) {
    return this.prismaService.charge.delete({
      where: {
        id,
      },
      select: selectOptions || this.chargeSelectOptions,
    });
  }

  chargeSelectOptions = {
    id: true,
    fee: true,
    tax: true,
    owner: {
      select: {
        id: true,
        nama: true,
      },
    },
    createdAt: true,
    updatedAt: true,
  };
}
