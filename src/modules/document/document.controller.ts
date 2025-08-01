import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { AssociateDocumentToEmployeeDto } from './dto/associate-document-to-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileLoggingPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    if (value.mimetype != 'application/pdf') {
      throw new BadRequestException('O arquivo precisa ser em pdf');
    }

    if (value.size > 1000000) {
      throw new BadRequestException('O arquivo precisa ser até 1MB');
    }
    return value;
  }
}

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
  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('id') id: string,
    @UploadedFile(new FileLoggingPipe(), new ParseFilePipe())
    file: Express.Multer.File,
  ) {
    return this.documentService.upload(id, file);
  }
}
