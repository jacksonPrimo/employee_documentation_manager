// src/users/dto/create-user.dto.ts
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, MaxDate } from 'class-validator';

export class CreateEmployeeDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @IsDate({ message: 'A data de contratação precisa ser um campo de data' })
  @MaxDate(new Date(), {
    message: 'A data de contratação não pode ser maior que a data atual',
  })
  @Type(() => Date)
  hiredAt: Date;
}
