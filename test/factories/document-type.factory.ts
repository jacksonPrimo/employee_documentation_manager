import { DocumentType } from '@prisma/client';
import { FactoryInterface } from './factory.interface';
import { faker } from '@faker-js/faker';
import { PrismaService } from 'src/prisma/prisma.service';

export class DocumentTypeFactory implements FactoryInterface<DocumentType> {
  private service: PrismaService;
  private instance: DocumentType;
  constructor() {
    this.service = new PrismaService();
  }
  async getInstance() {
    if (this.instance) {
      const updatedInstance = await this.service.documentType.findUnique({
        where: { id: this.instance.id },
      });
      this.instance = updatedInstance as DocumentType;
      return this.instance;
    } else {
      this.instance = await this.service.documentType.create({
        data: {
          name: faker.word.noun(),
        },
      });
      return this.instance;
    }
  }
}
