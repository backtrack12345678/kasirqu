import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IAuth } from '../auth/interfaces/auth.interface';
import { CategoryRepository } from './repositories/category.repository';
import { ErrorService } from '../common/error/error.service';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    private errorService: ErrorService,
  ) {}

  async create(auth: IAuth, payload: CreateCategoryDto) {
    const ownerId: string = auth.id;

    const category = await this.categoryRepo.createCategory(
      {
        ownerId,
        ...payload,
      },
      this.categorySelectOptions,
    );

    return category;
  }

  async findAll(auth: IAuth) {
    const ownerId: string = auth.id;

    const categories = await this.categoryRepo.getCategories(
      this.categorySelectOptions,
      {
        ownerId,
      },
    );

    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async checkCategoryOwner(ownerId: string, categoryId: number) {
    const category = await this.categoryRepo.getCategoryById(categoryId, {
      ownerId: true,
    });

    if (!category) {
      this.errorService.notFound('Kategori Tidak Ditemukan');
    }

    if (ownerId !== category.ownerId) {
      this, this.errorService.forbidden('Kategori Bukan Milik Pengguna Ini');
    }
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
