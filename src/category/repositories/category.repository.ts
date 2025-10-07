import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private prismaService: PrismaService) {}

  async createCategory<T extends Prisma.CategorySelect>(
    data: Prisma.CategoryUncheckedCreateInput,
    selectOptions?: T,
  ) {
    return this.prismaService.category.create({
      data,
      select: selectOptions || this.categorySelectOptions,
    });
  }

  async getCategoryById<T extends Prisma.CategorySelect>(
    id: number,
    selectOptions?: T,
  ) {
    return this.prismaService.category.findUnique({
      where: {
        id,
      },
      select: selectOptions || this.categorySelectOptions,
    });
  }

  async getCategories<T extends Prisma.CategorySelect>(selectOptions?: T) {
    return this.prismaService.category.findMany({
      select: selectOptions || this.categorySelectOptions,
    });
  }

  async getCategoriesByOwnerId<T extends Prisma.CategorySelect>(
    ownerId: string,
    selectOptions?: T,
  ) {
    return this.prismaService.category.findMany({
      where: {
        ownerId,
      },
      select: selectOptions || this.categorySelectOptions,
    });
  }

  async updateCategoryById<T extends Prisma.CategorySelect>(
    id: number,
    data: Prisma.CategoryUpdateInput,
    selectOptions?: T,
  ) {
    return this.prismaService.category.update({
      where: {
        id,
      },
      data,
      select: selectOptions || this.categorySelectOptions,
    });
  }

  async deleteCategoryById<T extends Prisma.CategorySelect>(
    id: number,
    selectOptions?: T,
  ) {
    return this.prismaService.category.delete({
      where: {
        id,
      },
      select: selectOptions || this.categorySelectOptions,
    });
  }

  categorySelectOptions = {
    id: true,
    nama: true,
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
