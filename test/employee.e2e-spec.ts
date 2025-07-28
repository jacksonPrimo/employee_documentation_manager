import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { EmployeeModule } from 'src/modules/employee/employee.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Employee } from '@prisma/client';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EmployeeModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/register (POST)', () => {
    describe('success cases', () => {
      it('return an error case name and hired date are empty', async () => {
        const response = await request(app.getHttpServer())
          .post('/employee')
          .send({ name: 'jackson', hiredAt: '2023-07-12T00:00:00.000Z' })
          .expect(201);
        const createdEmployee = response.body as Employee;
        expect(createdEmployee.name).toEqual('jackson');
        expect(createdEmployee.hiredAt).toEqual('2023-07-12T00:00:00.000Z');
      });
    });

    describe('failure cases', () => {
      it('return an error case name is empty', () => {
        return request(app.getHttpServer())
          .post('/employee')
          .send({ name: '', hiredAt: '2023-07-12T00:00:00.000Z' })
          .expect(400)
          .expect({
            message: ['O nome não pode ser vazio.'],
            error: 'Bad Request',
            statusCode: 400,
          });
      });

      it('return an error case date is greater then today', () => {
        const hiredAt = new Date();
        hiredAt.setDate(hiredAt.getDate() + 1);
        console.log(hiredAt);
        return request(app.getHttpServer())
          .post('/employee')
          .send({ name: 'jackson', hiredAt: hiredAt })
          .expect(400)
          .expect({
            message: [
              'A data de contratação não pode ser maior que a data atual',
            ],
            error: 'Bad Request',
            statusCode: 400,
          });
      });

      it('return an error case date is empty', () => {
        return request(app.getHttpServer())
          .post('/employee')
          .send({ name: 'jackson', hiredAt: '' })
          .expect(400)
          .expect({
            message: [
              'A data de contratação não pode ser maior que a data atual',
              'A data de contratação precisa ser um campo de data',
            ],
            error: 'Bad Request',
            statusCode: 400,
          });
      });
    });
  });
});
