import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeRepository {
  constructor(private prismaService: PrismaService) {}

  async updateEmployeeById<T extends Prisma.EmployeeSelect>(
    id: string,
    data: Prisma.EmployeeUpdateInput,
    selectOptions?: T,
  ) {
    return this.prismaService.employee.update({
      where: {
        id,
      },
      data,
      select: selectOptions || this.employeeSelectOptions,
    });
  }

  async deleteEmployeeById<T extends Prisma.EmployeeSelect>(
    id: string,
    selectOptions?: T,
  ) {
    return this.prismaService.employee.delete({
      where: {
        id,
      },
      select: selectOptions || this.employeeSelectOptions,
    });
  }

  private employeeSelectOptions = {
    id: true,
    email: true,
    nama: true,
    role: true,
    ownerId: true,
  };
}
