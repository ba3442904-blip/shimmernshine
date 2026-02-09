import { PrismaClient } from "@prisma/client";
import { cache } from "react";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const createNodeClient = () =>
  new PrismaClient({
    log: ["error"],
  });

export const getDb = cache(() => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createNodeClient();
  }

  return globalForPrisma.prisma;
});
