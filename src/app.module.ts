import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './modules/employee/employee.module';

@Module({
  imports: [EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
