import { Document } from '@prisma/client';
import { FactoryInterface } from './factory.interface';
import { PrismaService } from 'src/prisma/prisma.service';

export class DocumentFactory implements FactoryInterface<Document> {
  private service: PrismaService;
  private instance: Document;
  constructor(
    private employeeId: string,
    private documentTypeId: string,
  ) {
    this.service = new PrismaService();
  }
  async getInstance() {
    if (this.instance) {
      const updatedInstance = await this.service.document.findUnique({
        where: { id: this.instance.id },
      });
      this.instance = updatedInstance as Document;
      return this.instance;
    } else {
      this.instance = await this.service.document.create({
        data: {
          employeeId: this.employeeId,
          documentTypeId: this.documentTypeId,
        },
      });
      return this.instance;
    }
  }
}
