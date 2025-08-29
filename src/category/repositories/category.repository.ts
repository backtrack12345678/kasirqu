import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private prismaService: PrismaService) {}

  async createCategory<T extends Prisma.CategorySelect>(
    data: Prisma.CategoryUncheckedCreateInput,
    selectOptions?: T,
  ): Promise<Prisma.CategoryGetPayload<{ select: T }>> {
    return this.prismaService.category.create({
      data,
      select: selectOptions || undefined,
    });
  }

  async getCategoryById<T extends Prisma.CategorySelect>(
    id: number,
    selectOptions?: T,
  ): Promise<Prisma.CategoryGetPayload<{ select: T }>> {
    return this.prismaService.category.findUnique({
      where: {
        id,
      },
      select: selectOptions || undefined,
    });
  }

  async getCategories<T extends Prisma.CategorySelect>(
    selectOptions?: T,
    whereOptions?: Prisma.CategoryWhereInput,
  ): Promise<Prisma.CategoryGetPayload<{ select: T }>[]> {
    return this.prismaService.category.findMany({
      select: selectOptions || undefined,
      where: whereOptions,
    });
  }
}
