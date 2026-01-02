import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDatabaseUrl, parseDbConnectionInfo } from "@/lib/dbUrl";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let dbHost = "unknown";
  let dbName = "unknown";
  let dbUser = "unknown";
  
  try {
    // Parse connection info from URL (without password)
    const connectionUrl = getDatabaseUrl();
    const info = parseDbConnectionInfo(connectionUrl);
    dbHost = info.host;
    dbName = info.database;
    dbUser = info.user;
    
    // Test actual database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      ok: true,
      dbHost,
      dbName,
      dbUser,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
        dbHost,
        dbName,
        dbUser,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
