/**
 * Affiliate URL builders with optional tracking IDs.
 * Falls back to generic URLs if env vars not set.
 */

interface FlightUrlParams {
  countryCode: string;
  countryName: string;
  month: number;
  from?: string;
}

interface StayUrlParams {
  countryCode: string;
  countryName: string;
  month: number;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Build affiliate flight search URL.
 * Uses Skyscanner affiliate ID if available, else Google Flights.
 */
export function buildFlightUrl({ countryName, month }: FlightUrlParams): string {
  const affiliateId = process.env.AFFILIATE_SKYSCANNER_ID;
  const monthName = MONTH_NAMES[month - 1] || "";
  
  if (affiliateId) {
    // Skyscanner affiliate URL format
    return `https://www.skyscanner.com/transport/flights/us/${encodeURIComponent(countryName.toLowerCase())}/?associateid=${affiliateId}&utm_source=zentrip&utm_campaign=${monthName.toLowerCase()}`;
  }
  
  // Fallback to Google Flights
  return `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(countryName)}+in+${encodeURIComponent(monthName)}`;
}

/**
 * Build affiliate stays/hotel search URL.
 * Uses Booking.com affiliate ID if available, else Google Hotels.
 */
export function buildStayUrl({ countryName, month }: StayUrlParams): string {
  const affiliateId = process.env.AFFILIATE_BOOKING_ID;
  const monthName = MONTH_NAMES[month - 1] || "";
  
  if (affiliateId) {
    // Booking.com affiliate URL format
    return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(countryName)}&aid=${affiliateId}&utm_source=zentrip&utm_campaign=${monthName.toLowerCase()}`;
  }
  
  // Fallback to Google Hotels
  return `https://www.google.com/travel/hotels?q=hotels+in+${encodeURIComponent(countryName)}+${encodeURIComponent(monthName)}`;
}

/**
 * Get month name from number (1-12).
 */
export function getMonthName(month: number): string {
  return MONTH_NAMES[month - 1] || "Unknown";
}
