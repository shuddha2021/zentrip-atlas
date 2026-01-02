import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, isValidEventType } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
      || request.headers.get("x-real-ip") 
      || "unknown";
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { event, path, referrer, properties } = body;
    
    // Validate event type
    if (!event || typeof event !== "string") {
      return NextResponse.json(
        { ok: false, error: "Event is required" },
        { status: 400 }
      );
    }
    
    if (!isValidEventType(event)) {
      return NextResponse.json(
        { ok: false, error: "Invalid event type" },
        { status: 400 }
      );
    }
    
    // Store event (don't block response on DB write)
    prisma.analyticsEvent.create({
      data: {
        event,
        path: path || null,
        referrer: referrer || null,
        properties: properties || null,
        ip: ip !== "unknown" ? ip.substring(0, 45) : null, // Truncate for safety
      },
    }).catch((error: unknown) => {
      console.error("Failed to store analytics event:", error);
    });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Track error:", error);
    // Always return ok to not break client
    return NextResponse.json({ ok: true });
  }
}
