/**
 * SEO utilities for consistent metadata across the app.
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_SLUGS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/**
 * Parse a month slug (number or name) to a month number 1-12.
 */
export function parseMonthSlug(slug: string): number | null {
  // Try parsing as number first
  const num = parseInt(slug, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return num;
  }
  
  // Try parsing as name
  const normalized = slug.toLowerCase().trim();
  return MONTH_SLUGS[normalized] || null;
}

/**
 * Get month name from number.
 */
export function getMonthName(month: number): string {
  return MONTH_NAMES[month - 1] || "Unknown";
}

/**
 * Get the base URL for the site.
 */
export function getBaseUrl(): string {
  // Prefer NEXT_PUBLIC_SITE_URL, then Vercel URL, then localhost
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Check if indexing should be disabled (for staging/dev).
 */
export function shouldNoIndex(): boolean {
  return process.env.NOINDEX === "true";
}

/**
 * Build canonical URL.
 */
export function getCanonicalUrl(path: string): string {
  const base = getBaseUrl();
  return `${base}${path}`;
}
