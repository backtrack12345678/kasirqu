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
  @Roles(UserRole.OWNER)
  @Get()
  async findAll(@Req() request: any) {
    const result = await this.productService.findAll(request);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
