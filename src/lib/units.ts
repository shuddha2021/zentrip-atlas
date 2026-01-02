/**
 * Temperature conversion utilities.
 * DB stores Fahrenheit; UI displays Celsius.
 */

/**
 * Convert Fahrenheit to Celsius.
 */
export function fToC(f: number): number {
  return Math.round((f - 32) * (5 / 9));
}

/**
 * Format a Fahrenheit temperature range as Celsius string.
 * @param minF - minimum temperature in Fahrenheit
 * @param maxF - maximum temperature in Fahrenheit
 * @returns formatted string like "15–25°C"
 */
export function formatTempRangeC(minF: number, maxF: number): string {
  const minC = fToC(minF);
  const maxC = fToC(maxF);
  return `${minC}–${maxC}°C`;
}

/**
 * Format a single Fahrenheit temperature as Celsius.
 */
export function formatTempC(f: number): string {
  return `${fToC(f)}°C`;
}
