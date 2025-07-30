import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.$transaction([
    prisma.employee.deleteMany(),
    prisma.documentType.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
