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
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { Roles } from '../auth/decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { IAuth } from '../auth/interfaces/auth.interface';
import { IEmployeeResponse } from './interfaces/employee.interface';
import { IWebResponse } from '../common/interfaces/web.interface';
import { StatusResponse } from '../common/enums/web.enum';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Auth()
  @Roles(UserRole.OWNER)
  @Post()
  async create(
    @Req() request: any,
    @Body() payload: CreateEmployeeDto,
  ): Promise<IWebResponse<IEmployeeResponse>> {
    const result = await this.employeeService.create(request.user, payload);
    return {
      status: StatusResponse.SUCCESS,
      message: 'Karyawan Berhasil Ditambahkan',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.OWNER)
  @Get()
  async findAll(
    @Req() request: any,
  ): Promise<IWebResponse<IEmployeeResponse[]>> {
    const auth: IAuth = request.user;
    const result = await this.employeeService.findAll(auth);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.OWNER)
  @Get(':employeeId')
  async findOne(
    @Req() request: any,
    @Param('employeeId') employeeId: string,
  ): Promise<IWebResponse<IEmployeeResponse>> {
    const auth: IAuth = request.user;
    const result = await this.employeeService.findOne(auth, employeeId);
    return {
      status: StatusResponse.SUCCESS,
      data: result,
    };
  }

  // @Auth()
  // @Roles(UserRole.OWNER)
  // @Patch(':employeeId')
  // update(
  //   @Param('employeeId') employeeId: string,
  //   @Body() payload: UpdateEmployeeDto,
  // ) {
  //   return this.employeeService.update(employeeId, payload);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
