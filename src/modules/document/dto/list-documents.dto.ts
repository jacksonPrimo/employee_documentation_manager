import { Type } from 'class-transformer';
import { IsBoolean, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class ListDocumentsDto {
  @IsOptional()
  @IsString({ message: 'O filtro de colaborador deve ser uma string.' })
  employee: string;

  @IsOptional()
  @IsBoolean({
    message: 'O filtro de documentos pendentes precisa ser booleano',
  })
  pending: boolean;

  @IsOptional()
  @IsString({
    message: 'O filtro de tipo de documento precisa ser uma string',
  })
  type: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;
}
