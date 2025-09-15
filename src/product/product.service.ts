import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IAuth } from '../auth/interfaces/auth.interface';
import { ProductRepository } from './repositories/product.repository';
import { CategoryService } from '../category/category.service';
import { Prisma, UserRole } from '@prisma/client';
import { FileService } from '../file/file.service';
import { Request } from 'express';

@Injectable()
export class ProductService {
  constructor(
    private productRepo: ProductRepository,
    private categoryService: CategoryService,
    private fileService: FileService,
  ) {}

  async create(
    request: any,
    payload: CreateProductDto,
    media: Express.Multer.File,
  ) {
    const auth: IAuth = request.user;
    const ownerId = auth.id;
    const { harga, ...productPayload } = payload;

    await this.categoryService.checkCategoryOwner(
      ownerId,
      productPayload.categoryId,
    );

    const product = await this.productRepo.createProduct(
      {
        ownerId,
        ...productPayload,
        harga: Prisma.Decimal(harga),
        namaFile: 'test',
        path: 'tes',
      },
      this.productSelectOptions,
    );

    return this.toProductResponse(product, request);
  }

  async findAll(request: any) {
    const auth: IAuth = request.user;
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const products = await this.productRepo.getProducts(
      this.productSelectOptions,
      {
        ownerId,
      },
    );

    return products.map((product) => this.toProductResponse(product, request));
  }

  async findAllByIds(ids: number[], ownerId: string) {
    const products = await this.productRepo.getProducts(
      {
        id: true,
        nama: true,
        harga: true,
      },
      {
        id: {
          in: ids,
        },
        ownerId,
      },
    );

    return products;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  productSelectOptions = {
    id: true,
    nama: true,
    jumlah: true,
    harga: true,
    modal: true,
    namaFile: true,
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
    createdAt: true,
    updatedAt: true,
  };

  private toProductResponse(product, request: Request) {
    const { harga, namaFile, modal, ...productData } = product;
    return {
      ...productData,
      harga: harga.toString(),
      modal: modal.toString(),
      urlFile: `${this.fileService.getHostFile(request)}/file/transaction/${namaFile}`,
    };
  }
}
