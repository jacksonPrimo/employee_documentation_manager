import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './modules/employee/employee.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EmployeeModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
