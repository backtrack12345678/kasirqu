import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IAuth } from '../auth/interfaces/auth.interface';
import { CategoryRepository } from './repositories/category.repository';
import { ErrorService } from '../common/error/error.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    private errorService: ErrorService,
  ) {}

  async create(auth: IAuth, payload: CreateCategoryDto) {
    const ownerId: string = auth.id;

    const category = await this.categoryRepo.createCategory({
      ownerId,
      ...payload,
    });

    return category;
  }

  async findAll(auth: IAuth) {
    const ownerId: string =
      auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const categories = await this.categoryRepo.getCategoriesByOwnerId(ownerId);

    return categories;
  }

  async findOne(auth: IAuth, id: number) {
    const ownerId: string =
      auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const category = await this.checkCategoryOwner(ownerId, id);

    return category;
  }

  async update(auth: IAuth, id: number, payload: UpdateCategoryDto) {
    const category = await this.findOne(auth, id);

    const updatedCategory = await this.categoryRepo.updateCategoryById(
      category.id,
      payload,
    );

    return updatedCategory;
  }

  async remove(auth: IAuth, id: number) {
    const category = await this.findOne(auth, id);

    await this.categoryRepo.deleteCategoryById(category.id, {
      id: true,
    });
  }

  async checkCategoryOwner(ownerId: string, id: number) {
    const category = await this.categoryRepo.getCategoryById(id);

    if (!category) {
      this.errorService.notFound('Kategori Tidak Ditemukan');
    }

    if (ownerId !== category.owner.id) {
      this, this.errorService.forbidden('Kategori Bukan Milik Pengguna Ini');
    }

    return category;
  }
}
