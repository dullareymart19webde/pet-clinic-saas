import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const getDatabaseUrl = () => {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;
  
  // Vercel Prisma often fails to pass dynamic `datasourceUrl` correctly to the Rust engine
  // when using PgBouncer. To definitively fix the Neon "(not available)" username bug, 
  // we force a direct connection by stripping "-pooler" and "pgbouncer=true".
  url = url.replace('-pooler', '');
  url = url.replace('&pgbouncer=true', '');
  url = url.replace('?pgbouncer=true', '');
  
  return url;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
    datasourceUrl: getDatabaseUrl(),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
