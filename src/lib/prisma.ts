import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache } from "react";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

const createNodeClient = () =>
  new PrismaClient({
    log: ["error"],
    datasources: {
      db: { url: databaseUrl },
    },
  });

export const getDb = cache(() => {
  try {
    const { env } = getCloudflareContext();
    const cfEnv =
      env as unknown as
        | {
            DB?: D1Database;
          }
        | undefined;
    if (cfEnv?.DB) {
      const adapter = new PrismaD1(cfEnv.DB);
      return new PrismaClient({ adapter });
    }
  } catch {
    // Not running in Cloudflare/OpenNext.
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createNodeClient();
  }

  return globalForPrisma.prisma;
});
