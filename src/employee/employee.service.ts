import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { ErrorService } from '../common/error/error.service';
import { IAuth } from '../auth/interfaces/auth.interface';
import { v4 as uuid } from 'uuid';
import { IEmployeeResponse } from './interfaces/employee.interface';

@Injectable()
export class EmployeeService {
  constructor(
    private prismaService: PrismaService,
    private errorService: ErrorService,
  ) {}

  async create(
    auth: IAuth,
    payload: CreateEmployeeDto,
  ): Promise<IEmployeeResponse> {
    await this.checkEmployeeLimit(auth.id);
    await this.checkIsEmployeeExist(payload.email);

    const employee = await this.prismaService.employee.create({
      data: {
        id: `employee-${uuid().toString()}`,
        ownerId: auth.id,
        ...payload,
      },
      select: this.employeeSelectCondition,
    });

    return employee;
  }

  findAll() {
    return `This action returns all employee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  private async checkEmployeeLimit(ownerId: string): Promise<void> {
    const MAX_EMPLOYEES = 5;

    const countEmployee = await this.prismaService.employee.count({
      where: {
        ownerId,
        isActive: true,
      },
    });

    if (countEmployee >= MAX_EMPLOYEES) {
      this.errorService.badRequest(
        `Karyawan Sudah Mencapai Batas Maksimal ${MAX_EMPLOYEES} Orang`,
      );
    }
  }

  private async checkIsEmployeeExist(email: string) {
    const countEmployee = await this.prismaService.employee.count({
      where: {
        email,
      },
    });

    if (countEmployee !== 0) {
      this.errorService.badRequest('Karyawan Dengan Email Ini Sudah Terdaftar');
    }
  }

  private employeeSelectCondition = {
    id: true,
    email: true,
    nama: true,
    role: true,
    isActive: true,
  };
}
