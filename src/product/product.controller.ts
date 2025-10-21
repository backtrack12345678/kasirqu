import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  UseInterceptors,
  ParseFilePipeBuilder,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesValidator } from '../file/pipes/files.validator';
import { StatusResponse } from '../common/enums/web.enum';
import { GetAllQueryDto } from './dto/get-product.dto';

const allowedMimeTypes = {
  media: ['image/png', 'image/jpg', 'image/jpeg'],
};
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth()
  @Roles(UserRole.OWNER)
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('media', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @Post()
  async create(
    @Req() request: any,
    @Body() payload: CreateProductDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FilesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    media: Express.Multer.File,
  ) {
    const result = await this.productService.create(request, payload, media);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Produk Berhasil Dibuat',
      data: result,
    };
  }

  @Auth()
  @Get()
  async findAll(@Req() request: any, @Query() query: GetAllQueryDto) {
    const result = await this.productService.findAll(request, query);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Get(':id')
  async findOne(@Req() request: any, @Param('id') id: string) {
    const result = await this.productService.findOne(request, id);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.OWNER)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('media', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Req() request: any,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FilesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build({
          fileIsRequired: false,
        }),
    )
    media: Express.Multer.File,
  ) {
    const result = await this.productService.update(
      request,
      id,
      updateProductDto,
      media,
    );
    return {
      status: StatusResponse.SUCCESS,
      message: 'Produk Berhasil Diperbarui',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.OWNER)
  @Delete(':id')
  async remove(@Req() request: any, @Param('id') id: string) {
    const result = await this.productService.remove(request, id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Produk Berhasil Dihapus',
      data: result,
    };
  }
}
