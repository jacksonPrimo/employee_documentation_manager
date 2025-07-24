import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { PrismaUtil } from 'src/utils/prisma.util';

@Module({
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    { provide: PrismaUtil, useValue: PrismaUtil.getInstance() },
  ],
})
export class EmployeeModule {}
