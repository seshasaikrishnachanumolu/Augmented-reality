import { PrismaClient } from "@prisma/client";

/**
 * Standard Next.js dev-mode Prisma singleton: without this, every hot-reload
 * of a server module would create a brand new PrismaClient and eventually
 * exhaust SQLite/Postgres connections. In production a single instance per
 * process is created normally.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
