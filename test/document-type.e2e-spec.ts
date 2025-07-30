import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DocumentType } from '@prisma/client';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'src/prisma/prisma-client-exception.filter';
import { DocumentTypeModule } from 'src/modules/document-type/document-type.module';
import { DocumentTypeFactory } from './factories/document-type.factory';

describe('DocumentTypeController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DocumentTypeModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();
  });

  describe('/ (POST)', () => {
    describe('success cases', () => {
      it('return data of new document type created', async () => {
        const response = await request(app.getHttpServer())
          .post('/document-type')
          .send({ name: 'cpf' })
          .expect(201);
        const createdDocumentType = response.body as DocumentType;
        expect(createdDocumentType.name).toEqual('cpf');
      });
    });

    describe('failure cases', () => {
      it('return an error case name is empty', () => {
        return request(app.getHttpServer())
          .post('/document-type')
          .send({ name: '' })
          .expect(400)
          .expect({
            message: ['O nome não pode ser vazio.'],
            error: 'Bad Request',
            statusCode: 400,
          });
      });
      it('return an error case name is already in use', async () => {
        const documentType = await new DocumentTypeFactory().getInstance();
        return request(app.getHttpServer())
          .post('/document-type')
          .send({ name: documentType.name })
          .expect(409)
          .expect({
            message: 'Já existe um registro com este name.',
            statusCode: 409,
          });
      });
    });
  });

  describe('/ (PUT)', () => {
    describe('success cases', () => {
      it('return data updated', async () => {
        const documentTypeFactory = new DocumentTypeFactory();
        let documentType = await documentTypeFactory.getInstance();
        const response = await request(app.getHttpServer())
          .put(`/document-type/${documentType.id}`)
          .send({ name: 'cpf updated' })
          .expect(200);

        const createddocumentType = response.body as DocumentType;
        expect(createddocumentType.name).toEqual('cpf updated');
        documentType = await documentTypeFactory.getInstance();
        expect(documentType.name).toEqual('cpf updated');
      });
    });

    describe('failure cases', () => {
      it('return an error case documentType not found', async () => {
        return await request(app.getHttpServer())
          .put(`/document-type/wrong_id`)
          .send({ name: 'teste' })
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'O registro solicitado não foi encontrado.',
          });
      });

      it('return an error case name is empty when update', async () => {
        const documentTypeFactory = new DocumentTypeFactory();
        const documentType = await documentTypeFactory.getInstance();
        return await request(app.getHttpServer())
          .put(`/document-type/${documentType.id}`)
          .send({ name: '' })
          .expect(400)
          .expect({
            message: ['O nome não pode ser vazio.'],
            error: 'Bad Request',
            statusCode: 400,
          });
      });

      it('return an error case name is already in use', async () => {
        const documentType = await new DocumentTypeFactory().getInstance();
        const anotherDocumentType =
          await new DocumentTypeFactory().getInstance();
        return await request(app.getHttpServer())
          .put(`/document-type/${documentType.id}`)
          .send({ name: anotherDocumentType.name })
          .expect(409)
          .expect({
            message: 'Já existe um registro com este name.',
            statusCode: 409,
          });
      });
    });
  });

  describe('/ (DELETE)', () => {
    describe('success cases', () => {
      it('return data deleted', async () => {
        const documentTypeFactory = new DocumentTypeFactory();
        let documentType = await documentTypeFactory.getInstance();
        const response = await request(app.getHttpServer())
          .delete(`/document-type/${documentType.id}`)
          .expect(200);

        const createddocumentType = response.body as DocumentType;
        expect(createddocumentType.name).toEqual(documentType.name);
        documentType = await documentTypeFactory.getInstance();
        expect(documentType).toBe(null);
      });
    });

    describe('failure cases', () => {
      it('return an error case documentType not found', async () => {
        return await request(app.getHttpServer())
          .delete(`/document-type/wrong_id`)
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'O registro solicitado não foi encontrado.',
          });
      });
    });
  });
});
