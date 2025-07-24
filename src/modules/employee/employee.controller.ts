import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async Register(@Body() createEmployeeDto: CreateEmployeeDto): Promise<any> {
    const result = await this.employeeService.register(createEmployeeDto);
    return result;
  }
}
