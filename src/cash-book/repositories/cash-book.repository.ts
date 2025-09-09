import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CashBookStatus, Prisma } from '@prisma/client';
import { IGetCashBookOtherOptions } from '../interfaces/cash-book.interface';

@Injectable()
export class CashBookRepository {
  constructor(private prismaService: PrismaService) {}

  async createBook<T extends Prisma.CashBookSelect>(
    data: Prisma.CashBookUncheckedCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.CashBookGetPayload<{ select: T }>> {
    return this.prismaService.cashBook.create({
      data,
      select: selectOptions || undefined,
    });
  }

  async getCashBooks<T extends Prisma.CashBookSelect>(
    selectOptions?: T,
    whereOptions?: Prisma.CashBookWhereInput,
    otherOptions?: IGetCashBookOtherOptions,
  ): Promise<Prisma.CashBookGetPayload<{ select: T }>[]> {
    return this.prismaService.cashBook.findMany({
      select: selectOptions || undefined,
      where: whereOptions,
      ...otherOptions,
    });
  }

  async getCashBookById<T extends Prisma.CashBookSelect>(
    id: string,
    selectOptions?: T,
  ): Promise<Prisma.CashBookGetPayload<{ select: T }>> {
    return this.prismaService.cashBook.findUnique({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async updateCashBookById<T extends Prisma.CashBookSelect>(
    id: string,
    data: Prisma.CashBookUpdateInput,
    selectOptions?: T,
  ): Promise<Prisma.CashBookGetPayload<{ select: T }>> {
    return this.prismaService.cashBook.update({
      where: {
        id,
      },
      data,
      select: selectOptions || undefined,
    });
  }

  async getBookByOwnerIdAndStatus<T extends Prisma.CashBookSelect>(
    ownerId: string,
    status: CashBookStatus,
    selectOptions?: T,
  ): Promise<Prisma.CashBookGetPayload<{ select: T }>> {
    return this.prismaService.cashBook.findFirst({
      where: {
        ownerId,
        status,
      },
      select: selectOptions || undefined,
    });
  }
}
