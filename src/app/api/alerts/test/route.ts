import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 }
      );
    }
    
    const result = await sendEmail({
      to: email,
      subject: "[ZenTrip Atlas] Test Email",
      html: `
        <h1>Test Email from ZenTrip Atlas</h1>
        <p>This is a test email to verify your email configuration is working.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    });
    
    return NextResponse.json({
      ok: result.success,
      messageId: result.messageId,
      error: result.error,
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
