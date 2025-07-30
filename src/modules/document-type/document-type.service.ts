import { Injectable } from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DocumentType } from '@prisma/client';

@Injectable()
export class DocumentTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDocumentTypeDto): Promise<DocumentType> {
    return await this.prisma.documentType.create({
      data,
    });
  }

  async update(id: string, data: UpdateDocumentTypeDto): Promise<DocumentType> {
    return await this.prisma.documentType.update({
      where: { id: id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.documentType.delete({
      where: { id },
    });
  }
}
