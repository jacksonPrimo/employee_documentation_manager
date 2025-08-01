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

  describe('/document/:id/upload (POST)', () => {
    describe('success cases', () => {
      it('upload file and change pending status of document', async () => {
        const documentType = await new DocumentTypeFactory().getInstance();
        const employee = await new EmployeeFactory().getInstance();
        const documentFactory = new DocumentFactory(
          employee.id,
          documentType.id,
        );

        let document = await documentFactory.getInstance();
        expect(document.pending).toBeTruthy();
        const pdfBuffer = Buffer.from('123456', 'utf-8');
        await request(app.getHttpServer())
          .post(`/document/${document.id}/upload`)
          .attach('file', pdfBuffer, 'teste.pdf')
          .expect(201);
        document = await documentFactory.getInstance();
        expect(document.pending).toBeFalsy();
      });
    });

    describe('failure cases', () => {
      it('return an error case file is not in pdf format', async () => {
        const documentType = await new DocumentTypeFactory().getInstance();
        const employee = await new EmployeeFactory().getInstance();
        const documentFactory = new DocumentFactory(
          employee.id,
          documentType.id,
        );

        const document = await documentFactory.getInstance();
        const pdfBuffer = Buffer.from('123456', 'utf-8');
        await request(app.getHttpServer())
          .post(`/document/${document.id}/upload`)
          .attach('file', pdfBuffer, 'teste.jpg')
          .expect(400)
          .expect({
            message: 'O arquivo precisa ser em pdf',
            error: 'Bad Request',
            statusCode: 400,
          });
      });

      it('return an error case file already uploaded', async () => {
        const documentType = await new DocumentTypeFactory().getInstance();
        const employee = await new EmployeeFactory().getInstance();
        const documentFactory = new DocumentFactory(
          employee.id,
          documentType.id,
          false,
        );

        const document = await documentFactory.getInstance();
        const pdfBuffer = Buffer.from('123456', 'utf-8');
        await request(app.getHttpServer())
          .post(`/document/${document.id}/upload`)
          .attach('file', pdfBuffer, 'teste.pdf')
          .expect(409)
          .expect({
            message: 'Documento já enviado anteriormente',
            error: 'Conflict',
            statusCode: 409,
          });
      });

      it('return an error case pending document not found', async () => {
        const pdfBuffer = Buffer.from('123456', 'utf-8');
        await request(app.getHttpServer())
          .post(`/document/xxxxx/upload`)
          .attach('file', pdfBuffer, 'teste.pdf')
          .expect(404)
          .expect({
            message: 'Documento pendente com ID xxxxx não encontrado.',
            error: 'Not Found',
            statusCode: 404,
          });
      });
    });
  });

  describe('/document (GET)', () => {
    describe('success cases', () => {
      it('list without filters', async () => {
        const documentType = await new DocumentTypeFactory().getInstance();
        const employee = await new EmployeeFactory().getInstance();
        await new DocumentFactory(employee.id, documentType.id).getInstance();
        await new DocumentFactory(employee.id, documentType.id).getInstance();
        const response = await request(app.getHttpServer())
          .get(`/document`)
          .expect(200);
        const { meta, data } = response.body;
        expect(meta).toEqual({
          page: 1,
          total: 2,
        });
        expect(data.length).toBe(2);
      });

      it('list with pending filter', async () => {
        const documentType = await new DocumentTypeFactory().getInstance();
        const employee = await new EmployeeFactory().getInstance();
        await new DocumentFactory(employee.id, documentType.id).getInstance();
        await new DocumentFactory(
          employee.id,
          documentType.id,
          false,
        ).getInstance();
        const response = await request(app.getHttpServer())
          .get(`/document?pending=true`)
          .expect(200);
        const { meta, data } = response.body;
        expect(meta).toEqual({
          page: 1,
          total: 1,
        });
        expect(data.length).toBe(1);
      });

      it('list with employee filter', async () => {
        const documentType = await new DocumentTypeFactory().getInstance();
        const employee1 = await new EmployeeFactory().getInstance();
        const employee2 = await new EmployeeFactory().getInstance();
        await new DocumentFactory(employee1.id, documentType.id).getInstance();
        await new DocumentFactory(employee2.id, documentType.id).getInstance();
        const response = await request(app.getHttpServer())
          .get(`/document?employee=${employee1.id}`)
          .expect(200);
        const { meta, data } = response.body;
        expect(meta).toEqual({
          page: 1,
          total: 1,
        });
        expect(data.length).toBe(1);
      });

      it('list with type filter', async () => {
        const documentType1 = await new DocumentTypeFactory().getInstance();
        const documentType2 = await new DocumentTypeFactory().getInstance();
        const employee = await new EmployeeFactory().getInstance();
        await new DocumentFactory(employee.id, documentType1.id).getInstance();
        await new DocumentFactory(employee.id, documentType2.id).getInstance();
        const response = await request(app.getHttpServer())
          .get(`/document?type=${documentType1.id}`)
          .expect(200);
        const { meta, data } = response.body;
        expect(meta).toEqual({
          page: 1,
          total: 1,
        });
        expect(data.length).toBe(1);
      });

      it('list with pagination', async () => {
        const documentType = await new DocumentTypeFactory().getInstance();
        const employee = await new EmployeeFactory().getInstance();
        await new DocumentFactory(employee.id, documentType.id).getInstance();
        await new DocumentFactory(employee.id, documentType.id).getInstance();
        const response = await request(app.getHttpServer())
          .get(`/document?page=2`)
          .expect(200);
        const { meta, data } = response.body;
        expect(meta).toEqual({
          page: '2',
          total: 2,
        });
        expect(data.length).toBe(0);
      });
    });
  });
});
