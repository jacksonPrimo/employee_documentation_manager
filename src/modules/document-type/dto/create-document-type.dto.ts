import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentTypeDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;
}
