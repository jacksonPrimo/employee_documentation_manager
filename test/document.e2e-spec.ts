import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Document } from '@prisma/client';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'src/prisma/prisma-client-exception.filter';
import { DocumentModule } from 'src/modules/document/document.module';
import { EmployeeFactory } from './factories/employee.factory';
import { DocumentTypeFactory } from './factories/document-type.factory';
import { DocumentFactory } from './factories/document.factory';

describe('DocumentController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DocumentModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();
  });

  describe('/document/associate (POST)', () => {
    describe('success cases', () => {
      it('return a list of documents associateds to employee', async () => {
        const employee = await new EmployeeFactory().getInstance();
        const documentType1 = await new DocumentTypeFactory().getInstance();
        const documentType2 = await new DocumentTypeFactory().getInstance();
        const response = await request(app.getHttpServer())
          .post('/document/associate')
          .send({
            employeeId: employee.id,
            documentTypeIds: [documentType1.id, documentType2.id],
          })
          .expect(201);
        const createdDocuments = response.body as Document[];
        expect(createdDocuments.length).toBe(2);
        expect(createdDocuments.every((d) => d.employeeId == employee.id)).toBe(
          true,
        );
        expect(
          createdDocuments.some((d) => d.documentTypeId == documentType1.id),
        ).toBe(true);

        expect(
          createdDocuments.some((d) => d.documentTypeId == documentType2.id),
        ).toBe(true);
      });
    });

    describe('failure cases', () => {
      it('return an error case employeeId or documentTypeId empty', async () => {
        await request(app.getHttpServer())
          .post('/document/associate')
          .send({
            employeeId: '',
            documentTypeIds: [],
          })
          .expect(400)
          .expect({
            message: [
              'O tipo de documento não pode ser vazio.',
              'O colaborador não pode ser vazio.',
            ],
            error: 'Bad Request',
            statusCode: 400,
          });
      });

      it('return an error case employee not found', async () => {
        const documentType1 = await new DocumentTypeFactory().getInstance();
        await request(app.getHttpServer())
          .post('/document/associate')
          .send({
            employeeId: 'xxxx',
            documentTypeIds: [documentType1.id],
          })
          .expect(404)
          .expect({
            message: 'Funcionário com ID xxxx não encontrado.',
            error: 'Not Found',
            statusCode: 404,
          });
      });

      it('return an error case one of document types not found', async () => {
        const employee = await new EmployeeFactory().getInstance();
        const documentType1 = await new DocumentTypeFactory().getInstance();
        await request(app.getHttpServer())
          .post('/document/associate')
          .send({
            employeeId: employee.id,
            documentTypeIds: [documentType1.id, 'wrong id'],
          })
          .expect(404)
          .expect({
            message: 'Um ou mais tipos de documento não foram encontrados.',
            error: 'Not Found',
            statusCode: 404,
          });
      });
    });
  });

  describe('/document/disassociate (DELETE)', () => {
    describe('success cases', () => {
      it('return success and delete documents', async () => {
        const documentType = await new DocumentTypeFactory().getInstance();
        const employee = await new EmployeeFactory().getInstance();
        const documentFactory = new DocumentFactory(
          employee.id,
          documentType.id,
        );
        expect(await documentFactory.getInstance()).not.toBeNull();
        await request(app.getHttpServer())
          .delete('/document/disassociate')
          .send({
            employeeId: employee.id,
            documentTypeIds: [documentType.id],
          })
          .expect(200);
        expect(await documentFactory.getInstance()).toBeNull();
      });
    });

    describe('failure cases', () => {
      it('return an error case employeeId or documentTypeId empty', async () => {
        await request(app.getHttpServer())
          .delete('/document/disassociate')
          .send({
            employeeId: '',
            documentTypeIds: [],
          })
          .expect(400)
          .expect({
            message: [
              'O tipo de documento não pode ser vazio.',
              'O colaborador não pode ser vazio.',
            ],
            error: 'Bad Request',
            statusCode: 400,
          });
      });

      it('return an error case employee not found', async () => {
        const documentType1 = await new DocumentTypeFactory().getInstance();
        await request(app.getHttpServer())
          .delete('/document/disassociate')
          .send({
            employeeId: 'xxxx',
            documentTypeIds: [documentType1.id],
          })
          .expect(404)
          .expect({
            message: 'Funcionário com ID xxxx não encontrado.',
            error: 'Not Found',
            statusCode: 404,
          });
      });

      it('return an error case one of document types not found', async () => {
        const employee = await new EmployeeFactory().getInstance();
        const documentType1 = await new DocumentTypeFactory().getInstance();
        await request(app.getHttpServer())
          .delete('/document/disassociate')
          .send({
            employeeId: employee.id,
            documentTypeIds: [documentType1.id, 'wrong id'],
          })
          .expect(404)
          .expect({
            message: 'Um ou mais tipos de documento não foram encontrados.',
            error: 'Not Found',
            statusCode: 404,
          });
      });
    });
  });
});
