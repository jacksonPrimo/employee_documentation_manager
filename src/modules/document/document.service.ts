import { Injectable, NotFoundException } from '@nestjs/common';
import { AssociateDocumentToEmployeeDto } from './dto/associate-document-to-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Document } from '@prisma/client';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async associate(data: AssociateDocumentToEmployeeDto): Promise<Document[]> {
    const { employeeId, documentTypeIds } = data;
    const [employee, documentTypesCount] = await this.prisma.$transaction([
      this.prisma.employee.findUnique({
        where: { id: employeeId },
      }),
      this.prisma.documentType.count({
        where: { id: { in: documentTypeIds } },
      }),
    ]);

    if (!employee) {
      throw new NotFoundException(
        `Funcionário com ID ${employeeId} não encontrado.`,
      );
    }

    if (documentTypesCount !== documentTypeIds.length) {
      throw new NotFoundException(
        'Um ou mais tipos de documento não foram encontrados.',
      );
    }

    const documentsToCreate = documentTypeIds.map((docId) => ({
      employeeId: employee.id,
      documentTypeId: docId,
    }));

    await this.prisma.document.createMany({
      data: documentsToCreate,
      skipDuplicates: true,
    });

    const createdDocuments = await this.prisma.document.findMany({
      where: {
        employeeId: employee.id,
        documentTypeId: { in: documentTypeIds },
      },
    });

    return createdDocuments;
  }
}
