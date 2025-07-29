import { Employee } from '@prisma/client';
import { FactoryInterface } from './factory.interface';
import { faker } from '@faker-js/faker';
import { PrismaService } from 'src/prisma/prisma.service';

export class EmployeeFactory implements FactoryInterface<Employee> {
  private service: PrismaService;
  private instance: Employee;
  constructor() {
    this.service = new PrismaService();
  }
  async getInstance() {
    if (this.instance) {
      const updatedInstance = await this.service.employee.findUnique({
        where: { id: this.instance.id },
      });
      this.instance = updatedInstance as Employee;
      return this.instance;
    } else {
      this.instance = await this.service.employee.create({
        data: {
          name: faker.person.fullName(),
          hiredAt: faker.date.past({ years: 3 }),
        },
      });
      return this.instance;
    }
  }
}
