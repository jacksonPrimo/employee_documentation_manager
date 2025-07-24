// src/users/dto/create-user.dto.ts
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @IsDate({ message: 'A data de contratação precisa ser um campo de data' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'A data de contratação precisa ser preenchida' })
  hiredAt: Date;
}
