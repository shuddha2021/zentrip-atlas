import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { getDatabaseUrl, shouldUseSsl } from "./dbUrl";

declare global {
  var __prisma: PrismaClient | undefined;
  var __pool: Pool | undefined;
}

/**
 * Create a pg Pool with proper SSL configuration for Render/production.
 */
function createPool(): Pool {
  const connectionString = getDatabaseUrl();
  const useSsl = shouldUseSsl();
  
  return new Pool({
    connectionString,
    // Explicit SSL config for Render Postgres
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    // Connection pool limits for free tier
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

/**
 * Create PrismaClient with pg adapter.
 */
function createPrismaClient(pool: Pool): PrismaClient {
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Use global singleton to prevent connection exhaustion in dev
const pool = globalThis.__pool ?? createPool();
const prisma = globalThis.__prisma ?? createPrismaClient(pool);

// Cache in global scope for HMR in development
if (process.env.NODE_ENV !== "production") {
  globalThis.__pool = pool;
  globalThis.__prisma = prisma;
}

export { prisma, pool };
