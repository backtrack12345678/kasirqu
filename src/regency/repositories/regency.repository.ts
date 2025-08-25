import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { IGetRegenciesOtherOptions } from '../interfaces/regency.interface';

@Injectable()
export class RegencyRepository {
  constructor(private prismaService: PrismaService) {}

  async createRegency<T extends Prisma.Kota_KabupatenSelect>(
    data: Prisma.Kota_KabupatenUncheckedCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.Kota_KabupatenGetPayload<{ select: T }>> {
    return this.prismaService.kota_Kabupaten.create({
      data,
      select: selectOptions || undefined,
    });
  }

  async getRegencyById<T extends Prisma.Kota_KabupatenSelect>(
    id: number,
    selectOptions?: T,
  ): Promise<Prisma.Kota_KabupatenGetPayload<{ select: T }>> {
    return this.prismaService.kota_Kabupaten.findUnique({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async getRegencies<T extends Prisma.Kota_KabupatenSelect>(
    selectOptions?: T,
    whereOptions?: Prisma.Kota_KabupatenWhereInput,
    otherOptions?: IGetRegenciesOtherOptions,
  ): Promise<Prisma.Kota_KabupatenGetPayload<{ select: T }>[]> {
    return this.prismaService.kota_Kabupaten.findMany({
      where: whereOptions,
      select: selectOptions || undefined,
      ...otherOptions,
    });
  }

  async deleteRegencyById<T extends Prisma.Kota_KabupatenSelect>(
    id: number,
    selectOptions?: T,
  ): Promise<Prisma.Kota_KabupatenGetPayload<{ select: T }>> {
    return this.prismaService.kota_Kabupaten.delete({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async updateRegencyById<T extends Prisma.Kota_KabupatenSelect>(
    id: number,
    data: Prisma.Kota_KabupatenUpdateInput,
    selectOptions?: T,
  ): Promise<Prisma.Kota_KabupatenGetPayload<{ select: T }>> {
    return this.prismaService.kota_Kabupaten.update({
      where: {
        id,
      },
      data,
      select: selectOptions || undefined,
    });
  }
}
