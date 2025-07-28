import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async register(params: CreateEmployeeDto): Promise<Employee> {
    const newEmployee = await this.prisma.employee.create({
      data: params,
    });
    return newEmployee;
  }

  async update(id: string, params: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.prisma.employee.update({
      where: { id: id },
      data: params,
    });

    return employee;
  }
}
