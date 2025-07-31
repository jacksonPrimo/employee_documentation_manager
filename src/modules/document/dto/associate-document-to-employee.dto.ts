import { IsArray, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator';

export class AssociateDocumentToEmployeeDto {
  @IsArray({ message: 'Os tipos de documentos deve ser um array de strings' })
  @ArrayMinSize(1, { message: 'O tipo de documento não pode ser vazio.' })
  documentTypeIds: string[];

  @IsString({ message: 'O colaborador deve ser uma string.' })
  @IsNotEmpty({ message: 'O colaborador não pode ser vazio.' })
  employeeId: string;
}
