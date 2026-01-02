import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var __prisma: PrismaClient | undefined;
  var __pool: Pool | undefined;
}

function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return new Pool({ connectionString: url });
}

function createPrismaClient(pool: Pool) {
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const pool = globalThis.__pool ?? createPool();
export const prisma = globalThis.__prisma ?? createPrismaClient(pool);

if (process.env.NODE_ENV !== "production") {
  globalThis.__pool = pool;
  globalThis.__prisma = prisma;
}
