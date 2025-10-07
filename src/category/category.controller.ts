import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { Auth } from '../auth/decorator/auth.decorator';
import { IAuth } from '../auth/interfaces/auth.interface';
import { StatusResponse } from '../common/enums/web.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth()
  @Roles(UserRole.OWNER)
  @HttpCode(201)
  @Post()
  async create(@Req() request: any, @Body() payload: CreateCategoryDto) {
    const auth: IAuth = request.user;
    const result = await this.categoryService.create(auth, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kategori Berhasil Dibuat',
      data: result,
    };
  }

  @Auth()
  @Get()
  async findAll(@Req() request: any) {
    const auth: IAuth = request.user;
    const result = await this.categoryService.findAll(auth);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Get(':id')
  async findOne(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
    const auth: IAuth = request.user;
    const result = await this.categoryService.findOne(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.OWNER)
  @Patch(':id')
  async update(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const auth: IAuth = request.user;
    const result = await this.categoryService.update(
      auth,
      id,
      updateCategoryDto,
    );
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kategori Berhasil Diperbarui',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.OWNER)
  @Delete(':id')
  async remove(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
    const auth: IAuth = request.user;
    await this.categoryService.remove(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Kategori Berhasil Dihapus',
      data: true,
    };
  }
}
