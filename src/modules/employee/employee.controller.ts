import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async Register(@Body() createEmployeeDto: CreateEmployeeDto): Promise<any> {
    const result = await this.employeeService.register(createEmployeeDto);
    return result;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.CREATED)
  async Update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<any> {
    return await this.employeeService.update(id, updateEmployeeDto);
  }

  @Get('/:id/documentation-status')
  async DocumentationStatus(@Param('id') id: string): Promise<any> {
    return await this.employeeService.documentationStatus(id);
  }
}
