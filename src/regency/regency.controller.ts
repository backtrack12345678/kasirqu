import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RegencyService } from './regency.service';
import { CreateRegencyDto } from './dto/create-regency.dto';
import { UpdateRegencyDto } from './dto/update-regency.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { GetAllQueryDto } from './dto/get-regency.dto';
import { IWebResponse } from '../common/interfaces/web.interface';
import { IRegencyResponse } from './interfaces/regency.interface';

@Controller('regency')
export class RegencyController {
  constructor(private readonly regencyService: RegencyService) {}

  @Post()
  create(@Body() createRegencyDto: CreateRegencyDto) {
    return this.regencyService.create(createRegencyDto);
  }

  @Auth()
  @Get()
  async findAll(
    @Query() query: GetAllQueryDto,
  ): Promise<IWebResponse<IRegencyResponse[]>> {
    const result = await this.regencyService.findAll(query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regencyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegencyDto: UpdateRegencyDto) {
    return this.regencyService.update(+id, updateRegencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regencyService.remove(+id);
  }
}
