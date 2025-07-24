import { Injectable } from '@nestjs/common';
import { PrismaUtil } from 'src/utils/prisma.util';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaUtil) {}

  async register(params: CreateEmployeeDto): Promise<Employee> {
    const newEmployee = await this.prisma.employee.create({
      data: params,
    });
    return newEmployee;
  }
}
