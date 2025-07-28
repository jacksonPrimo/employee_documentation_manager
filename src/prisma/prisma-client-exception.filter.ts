//src/prisma-client-exception.filter.ts

import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P1000': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: `A autenticação do banco de dados falhou`,
        });
        break;
      }
      case 'P1001': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: `O servidor do banco de dados está inacessível`,
        });
        break;
      }
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[])?.join(', ');
        response.status(status).json({
          statusCode: status,
          message: `Já existe um registro com este ${target}.`,
        });
        break;
      }
      case 'P1003': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: `O banco de dados especificado não existe.`,
        });
        break;
      }
      case 'P1008': {
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
          statusCode: status,
          message: 'A operação excedeu o tempo limite.',
        });
        break;
      }
      case 'P1017': {
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
          statusCode: status,
          message: 'O servidor encerrou a conexão com o banco de dados.',
        });
        break;
      }
      case 'P2000': {
        const status = HttpStatus.BAD_REQUEST;
        const target = (exception.meta?.target as string[])?.join(', ');
        response.status(status).json({
          statusCode: status,
          message: `O valor fornecido para o campo '${target}' é muito longo.`,
        });
        break;
      }
      case 'P2003': {
        const status = HttpStatus.BAD_REQUEST;
        const fieldName = exception.meta?.field_name as string;
        response.status(status).json({
          statusCode: status,
          message: `Falha na restrição de chave estrangeira no campo '${fieldName}'. O registro relacionado não existe.`,
        });
        break;
      }
      case 'P2004': {
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
          statusCode: status,
          message: 'Uma violação de restrição ocorreu no banco de dados.',
        });
        break;
      }
      case 'P2011': {
        const status = HttpStatus.BAD_REQUEST;
        const target = (exception.meta?.target as string[])?.join(', ');
        response.status(status).json({
          statusCode: status,
          message: `A restrição de valor nulo foi violada no campo '${target}'.`,
        });
        break;
      }
      case 'P2014': {
        const status = HttpStatus.BAD_REQUEST;
        const modelName = exception.meta?.model_name as string;
        const relationName = exception.meta?.relation_name as string;
        response.status(status).json({
          statusCode: status,
          message: `A alteração que você está tentando fazer violaria a relação obrigatória '${relationName}' entre os modelos '${modelName}'.`,
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: 'O registro solicitado não foi encontrado.',
        });
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}
