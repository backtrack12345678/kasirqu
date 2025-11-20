import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  Req,
  UploadedFile,
  ParseFilePipeBuilder,
  ParseIntPipe,
} from '@nestjs/common';
import { QrisService } from './qris.service';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesValidator } from '../file/pipes/files.validator';
import { StatusResponse } from '../common/enums/web.enum';
import { Auth } from '../auth/decorator/auth.decorator';

const allowedMimeTypes = {
  media: ['image/png', 'image/jpg', 'image/jpeg'],
};

@Controller('qris')
export class QrisController {
  constructor(private readonly qrisService: QrisService) {}

  @Post()
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
  async create(
    @Req() request: any,
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
    const result = await this.qrisService.create(request, media);
    return {
      status: StatusResponse.SUCCESS,
      message: 'QRIS Berhasil Dibuat',
      data: result,
    };
  }

  @Get()
  @Auth()
  async findAll(@Req() request: any) {
    const result = await this.qrisService.findAll(request);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Get(':id')
  @Auth()
  async findOne(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
    const result = await this.qrisService.findOne(request, id);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Patch(':id')
  @Auth()
  @Roles(UserRole.OWNER)
  @UseInterceptors(
    FileInterceptor('media', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
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
    const result = await this.qrisService.update(request, id, media);
    return {
      status: StatusResponse.SUCCESS,
      message: 'QRIS Berhasil Diperbarui',
      data: result,
    };
  }

  @Delete(':id')
  @Auth()
  @Roles(UserRole.OWNER)
  async remove(@Req() request, @Param('id', ParseIntPipe) id: number) {
    await this.qrisService.remove(request, id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'QRIS Berhasil Dihapus',
      data: true,
    };
  }
}
