/**
 * Simple in-memory rate limiting for analytics.
 */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // max events per window per IP

/**
 * Check if a request should be rate limited.
 * Returns true if the request is allowed.
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  entry.count++;
  return true;
}

/**
 * Cleanup old entries periodically (call from API route if needed).
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}

/**
 * Valid analytics event types.
 */
export const VALID_EVENTS = [
  "page_view",
  "outbound_click",
  "save_trip",
  "share_click",
  "subscribe",
  "compare_months",
] as const;

export type AnalyticsEventType = typeof VALID_EVENTS[number];

/**
 * Validate an event type.
 */
export function isValidEventType(event: string): event is AnalyticsEventType {
  return VALID_EVENTS.includes(event as AnalyticsEventType);
}
