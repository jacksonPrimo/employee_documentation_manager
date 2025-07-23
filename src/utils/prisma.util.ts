import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaUtil extends PrismaClient {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!PrismaUtil.instance) {
      PrismaUtil.instance = new PrismaClient({ log: ['query', 'info'] });
    }

    return PrismaUtil.instance;
  }
}
