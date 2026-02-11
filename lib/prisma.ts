// lib/prisma.ts
import { PrismaClient } from '../prisma/generated/prisma/client/client';  // or your generated path if you customized output
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error('Missing POSTGRES_PRISMA_URL or DATABASE_URL in env, fix it dummy~ 💅');
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,  // ← The magic Prisma 7 demands!
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}