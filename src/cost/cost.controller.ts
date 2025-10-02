import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Req,
} from '@nestjs/common';
import { CostService } from './cost.service';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { IAuth } from '../auth/interfaces/auth.interface';
import { StatusResponse } from '../common/enums/web.enum';

@Controller('cost')
export class CostController {
  constructor(private readonly costService: CostService) {}

  @Auth()
  @Roles(UserRole.OWNER)
  @HttpCode(201)
  @Post()
  async create(@Req() request: any, @Body() payload: CreateCostDto) {
    const auth: IAuth = request.user;
    const result = await this.costService.create(auth, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Biaya Berhasil Dibuat',
      data: result,
    };
  }

  @Get()
  findAll() {
    return this.costService.findAll();
  }

  @Auth()
  @Get(':id')
  async findOne(@Req() request: any, @Param('id') id: string) {
    const auth: IAuth = request.user;
    const result = await this.costService.findOne(auth, id);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCostDto: UpdateCostDto) {
    return this.costService.update(+id, updateCostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.costService.remove(+id);
  }
}
