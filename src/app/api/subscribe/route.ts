import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, sourcePage } = body;
    
    // Basic email validation
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if already subscribed
    const existing = await prisma.emailSubscriber.findUnique({
      where: { email: normalizedEmail },
    });
    
    if (existing) {
      // Reactivate if previously unsubscribed
      if (!existing.isActive) {
        await prisma.emailSubscriber.update({
          where: { email: normalizedEmail },
          data: { isActive: true },
        });
      }
      return NextResponse.json({ ok: true });
    }
    
    // Create new subscriber
    const confirmRequired = process.env.EMAIL_CONFIRM_REQUIRED === "true";
    
    await prisma.emailSubscriber.create({
      data: {
        email: normalizedEmail,
        sourcePage: sourcePage || null,
        confirmedAt: confirmRequired ? null : new Date(),
        isActive: true,
      },
    });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
