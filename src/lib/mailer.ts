/**
 * Email sending abstraction.
 * Uses console logging by default; integrates with Resend if API key is set.
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email. Falls back to console logging if no provider configured.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const { to, subject, html, text } = params;
  
  // Check for Resend API key
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "noreply@zentripatlas.com";
  
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, ""),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.message || "Failed to send email" };
      }
      
      const data = await response.json();
      return { success: true, messageId: data.id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
  
  // Fallback: log to console (dev mode)
  console.log("\n📧 [DEV MAILER] Would send email:");
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Body preview: ${html.substring(0, 200)}...`);
  console.log("");
  
  return { success: true, messageId: `dev-${Date.now()}` };
}

/**
 * Check if email sending is configured.
 */
export function isMailerConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
