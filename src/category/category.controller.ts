import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
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
  @Roles(UserRole.OWNER)
  @Get()
  async findAll(@Req() request: any) {
    const auth: IAuth = request.user;
    const result = await this.categoryService.findAll(auth);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
