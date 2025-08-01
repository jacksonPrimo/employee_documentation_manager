import { Body, Controller, Delete, Post } from '@nestjs/common';
import { DocumentService } from './document.service';
import { AssociateDocumentToEmployeeDto } from './dto/associate-document-to-employee.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('/associate')
  associate(@Body() body: AssociateDocumentToEmployeeDto) {
    return this.documentService.associate(body);
  }

  @Delete('/disassociate')
  disassociate(@Body() body: AssociateDocumentToEmployeeDto) {
    return this.documentService.disassociate(body);
  }
}
