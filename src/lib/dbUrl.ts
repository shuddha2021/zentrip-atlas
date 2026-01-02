/**
 * Database URL normalization for Render/Neon/Postgres.
 * Handles common issues with connection strings in different environments.
 */

/**
 * Check if we should use SSL for database connections.
 * Returns true for Render, production, or when DATABASE_URL contains render.com
 */
export function shouldUseSsl(): boolean {
  const isRender = !!process.env.RENDER;
  const isProduction = process.env.NODE_ENV === "production";
  const urlHasRender = (process.env.DATABASE_URL ?? "").includes("render.com") ||
                       (process.env.DIRECT_DATABASE_URL ?? "").includes("render.com");
  
  return isRender || isProduction || urlHasRender;
}

/**
 * Get the normalized database URL for Prisma/pg connections.
 * 
 * - Checks DIRECT_DATABASE_URL first, then DATABASE_URL
 * - Strips quotes if wrapped
 * - Trims whitespace
 * - Adds sslmode=require for Render databases if not already present
 * 
 * @throws Error if no database URL is configured
 */
export function getDatabaseUrl(): string {
  const rawUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;
  
  if (!rawUrl) {
    throw new Error(
      "Database URL not configured. " +
      "Please set DIRECT_DATABASE_URL or DATABASE_URL environment variable. " +
      "Checked: DIRECT_DATABASE_URL (undefined), DATABASE_URL (undefined)"
    );
  }
  
  // Trim whitespace
  let url = rawUrl.trim();
  
  // Strip surrounding quotes if present (common copy-paste issue)
  if ((url.startsWith('"') && url.endsWith('"')) || 
      (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1);
  }
  
  // For Render databases, ensure sslmode=require is set
  if (url.includes(".render.com") && !url.includes("sslmode=")) {
    url = url.includes("?") ? `${url}&sslmode=require` : `${url}?sslmode=require`;
  }
  
  return url;
}

/**
 * Parse connection info from a PostgreSQL URL for diagnostics.
 * Does NOT include password.
 */
export function parseDbConnectionInfo(url: string): {
  host: string;
  database: string;
  user: string;
  port: string;
} {
  try {
    // PostgreSQL URLs: postgresql://user:pass@host:port/database
    const parsed = new URL(url);
    return {
      host: parsed.hostname || "unknown",
      database: parsed.pathname?.slice(1) || "unknown",
      user: parsed.username || "unknown",
      port: parsed.port || "5432",
    };
  } catch {
    return {
      host: "parse-error",
      database: "parse-error",
      user: "parse-error",
      port: "parse-error",
    };
  }
}
