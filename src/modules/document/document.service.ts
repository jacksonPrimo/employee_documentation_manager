import { Injectable, NotFoundException } from '@nestjs/common';
import { AssociateDocumentToEmployeeDto } from './dto/associate-document-to-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Document, Employee } from '@prisma/client';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async associate(data: AssociateDocumentToEmployeeDto): Promise<Document[]> {
    const { employeeId, documentTypeIds } = data;
    const employee = await this.checkEmployeeAndDocumentTypes(
      employeeId,
      documentTypeIds,
    );

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

  async disassociate(data: AssociateDocumentToEmployeeDto): Promise<void> {
    const { employeeId, documentTypeIds } = data;
    await this.checkEmployeeAndDocumentTypes(employeeId, documentTypeIds);

    await this.prisma.document.deleteMany({
      where: {
        employeeId: employeeId,
        documentTypeId: { in: documentTypeIds },
      },
    });
  }

  private async checkEmployeeAndDocumentTypes(
    employeeId: string,
    documentTypeIds: string[],
  ): Promise<Employee> {
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

    return employee;
  }
}
