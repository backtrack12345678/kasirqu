import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
// import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { ErrorService } from '../common/error/error.service';
import { IAuth } from '../auth/interfaces/auth.interface';
import { v4 as uuid } from 'uuid';
import { IEmployeeResponse } from './interfaces/employee.interface';
import * as bcrypt from 'bcrypt';

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

    const { password, ...employeeData } = payload;
    const id = `employee-${uuid().toString()}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await this.prismaService.employee.create({
      data: {
        id,
        ownerId: auth.id,
        ...employeeData,
        password: hashedPassword,
      },
      select: this.employeeSelectCondition,
    });

    return employee;
  }

  async findAll(auth: IAuth): Promise<IEmployeeResponse[]> {
    const ownerId = auth.id;
    const employees = await this.prismaService.employee.findMany({
      where: {
        ownerId,
      },
      select: this.employeeSelectCondition,
    });

    return employees;
  }

  async profile(auth: IAuth): Promise<IEmployeeResponse> {
    const employee = await this.findOneById(auth.id);

    if (!employee) {
      this.errorService.notFound('Karyawan Tidak Ditemukan');
    }

    return employee;
  }

  async findOne(auth: IAuth, employeeId: string): Promise<IEmployeeResponse> {
    const employee = await this.checkEmployeeOwner(employeeId, auth.id);
    return employee;
  }

  async findOneByEmail(email: string): Promise<IEmployeeResponse> {
    const employee = await this.prismaService.employee.findUnique({
      where: {
        email,
      },
      select: {
        ...this.employeeSelectCondition,
        password: true,
      },
    });

    return employee;
  }

  async findOneById(id: string): Promise<IEmployeeResponse> {
    const employee = await this.prismaService.employee.findUnique({
      where: {
        id,
      },
      select: this.employeeSelectCondition,
    });

    return employee;
  }

  // update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
  //   return `This action updates a #${id} employee`;
  // }

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

  private async checkEmployeeOwner(employeeId: string, ownerId: string) {
    const employee = await this.prismaService.employee.findUnique({
      where: {
        id: employeeId,
      },
      select: this.employeeSelectCondition,
    });

    if (!employee || ownerId !== employee.ownerId) {
      this.errorService.notFound('Karyawan Tidak Ditemukan');
    }

    return employee;
  }

  private employeeSelectCondition = {
    id: true,
    email: true,
    nama: true,
    role: true,
    isActive: true,
    ownerId: true,
  };
}
