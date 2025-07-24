import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async register(params: CreateEmployeeDto): Promise<Employee> {
    const newEmployee = await this.prisma.employee.create({
      data: params,
    });
    return newEmployee;
  }
}
