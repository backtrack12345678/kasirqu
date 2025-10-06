import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IAuth } from '../auth/interfaces/auth.interface';
import { ProductRepository } from './repositories/product.repository';
import { CategoryService } from '../category/category.service';
import { Prisma, UserRole } from '@prisma/client';
import { FileService } from '../file/file.service';
import { Request } from 'express';
import { ErrorService } from '../common/error/error.service';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class ProductService {
  constructor(
    private productRepo: ProductRepository,
    private categoryService: CategoryService,
    private fileService: FileService,
    private errorService: ErrorService,
  ) {}

  async create(
    request: any,
    payload: CreateProductDto,
    media: Express.Multer.File,
  ) {
    const auth: IAuth = request.user;
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;
    const { harga, modal, ...productPayload } = payload;

    await this.categoryService.checkCategoryOwner(
      ownerId,
      productPayload.categoryId,
    );

    // const uploadedMedia = await this.fileService.writeFileStream(
    //   media,
    //   'product',
    // );

    const id = `product-${uuid().toString()}`;

    const product = await this.productRepo.createProduct({
      id,
      ownerId,
      ...productPayload,
      harga: new Prisma.Decimal(harga),
      modal: new Prisma.Decimal(modal),
      // namaFile: uploadedMedia.fileName,
      // path: uploadedMedia.filePath,
      namaFile: 'tes',
      path: 'tes',
    });

    return this.toProductResponse(product, request);
  }

  async findAll(request: any) {
    const auth: IAuth = request.user;
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const products = await this.productRepo.getProducts({
      ownerId,
    });

    return products.map((product) => this.toProductResponse(product, request));
  }

  async findAllByIds(ids: string[], ownerId: string) {
    const products = await this.productRepo.getProducts(
      {
        id: {
          in: ids,
        },
        ownerId,
      },
      {
        id: true,
        nama: true,
        harga: true,
      },
    );

    return products;
  }

  async findOne(request: any, id: string) {
    const auth: IAuth = request.user;
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const product = await this.productRepo.getProductById(id);

    if (!product || product.owner.id !== ownerId) {
      this.errorService.notFound('Produk Tidak Ditemukan');
    }

    return this.toProductResponse(product, request);
  }

  async update(
    request: any,
    id: string,
    payload: UpdateProductDto,
    media?: Express.Multer.File,
  ) {
    const auth: IAuth = request.user;
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;
    const { harga, modal, ...productPayload } = payload;

    const product = await this.findOne(request, id);

    console.log(payload.categoryId);

    if (payload.categoryId)
      await this.categoryService.checkCategoryOwner(
        ownerId,
        payload.categoryId,
      );

    // const uploadedMedia = media
    //   ? await this.fileService.writeFileStream(media, 'product')
    //   : null;

    const updatedProduct = await this.productRepo.updateProductById(id, {
      ...productPayload,
      harga: harga ? new Prisma.Decimal(harga) : undefined,
      modal: modal ? new Prisma.Decimal(modal) : undefined,
      // namaFile: uploadedMedia?.fileName,
      // path: uploadedMedia?.filePath,
      namaFile: 'tes',
      path: 'tes',
    });

    // if (uploadedMedia) {
    //   await this.fileService.deleteFile(product.path);
    // }

    return this.toProductResponse(updatedProduct, request);
  }

  async remove(request: any, id: string) {
    await this.findOne(request, id);

    const product = await this.productRepo.deleteProductById(id, {
      path: true,
    });

    // delete file
    // this.fileService.deleteFile(product.path);
  }

  private toProductResponse(product, request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { harga, namaFile, modal, path, ...productData } = product;
    return {
      ...productData,
      harga: harga.toString(),
      modal: modal?.toString() || null,
      urlFile: `${this.fileService.getHostFile(request)}/file/product/${namaFile}`,
    };
  }
}
