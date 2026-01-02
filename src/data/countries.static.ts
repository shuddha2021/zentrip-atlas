/**
 * Static country data for build-time usage.
 * This file contains NO database imports and is safe to use during next build.
 * 
 * Used for:
 * - generateStaticParams (if needed)
 * - generateMetadata fallback
 * - sitemap generation
 * - Any build-time data needs
 * 
 * This data mirrors the seed data in prisma/seed.ts
 */

export interface StaticCountry {
  code: string;
  name: string;
  region: string;
  tags: string[];
}

export const staticCountries: StaticCountry[] = [
  { code: "ES", name: "Spain", region: "Europe", tags: ["beach", "culture", "food", "nightlife"] },
  { code: "IT", name: "Italy", region: "Europe", tags: ["culture", "food", "history", "romance"] },
  { code: "FR", name: "France", region: "Europe", tags: ["culture", "food", "romance", "wine"] },
  { code: "PT", name: "Portugal", region: "Europe", tags: ["beach", "surf", "wine", "history"] },
  { code: "GR", name: "Greece", region: "Europe", tags: ["beach", "history", "islands", "food"] },
  { code: "TH", name: "Thailand", region: "Asia", tags: ["beach", "temples", "food", "budget"] },
  { code: "JP", name: "Japan", region: "Asia", tags: ["culture", "food", "temples", "modern"] },
  { code: "VN", name: "Vietnam", region: "Asia", tags: ["food", "history", "budget", "nature"] },
  { code: "ID", name: "Indonesia", region: "Asia", tags: ["beach", "surf", "temples", "nature"] },
  { code: "AU", name: "Australia", region: "Oceania", tags: ["beach", "nature", "adventure", "wildlife"] },
  { code: "NZ", name: "New Zealand", region: "Oceania", tags: ["nature", "adventure", "film", "hiking"] },
  { code: "MX", name: "Mexico", region: "Americas", tags: ["beach", "culture", "food", "history"] },
  { code: "BR", name: "Brazil", region: "Americas", tags: ["beach", "carnival", "nature", "adventure"] },
  { code: "AR", name: "Argentina", region: "Americas", tags: ["wine", "tango", "steak", "nature"] },
  { code: "CO", name: "Colombia", region: "Americas", tags: ["coffee", "salsa", "nature", "culture"] },
  { code: "PE", name: "Peru", region: "Americas", tags: ["history", "food", "nature", "adventure"] },
  { code: "MA", name: "Morocco", region: "Africa", tags: ["culture", "desert", "food", "markets"] },
  { code: "ZA", name: "South Africa", region: "Africa", tags: ["wildlife", "wine", "nature", "adventure"] },
  { code: "EG", name: "Egypt", region: "Africa", tags: ["history", "pyramids", "desert", "diving"] },
  { code: "KE", name: "Kenya", region: "Africa", tags: ["safari", "wildlife", "nature", "beach"] },
  { code: "AE", name: "UAE", region: "Middle East", tags: ["luxury", "modern", "shopping", "desert"] },
  { code: "TR", name: "Turkey", region: "Middle East", tags: ["culture", "food", "history", "beach"] },
  { code: "HR", name: "Croatia", region: "Europe", tags: ["beach", "islands", "history", "sailing"] },
  { code: "IS", name: "Iceland", region: "Europe", tags: ["nature", "adventure", "northern-lights", "hiking"] },
];

/**
 * Lookup a country by code (case-insensitive)
 */
export function getStaticCountry(code: string): StaticCountry | undefined {
  const normalized = code.toUpperCase().trim();
  return staticCountries.find((c) => c.code === normalized);
}

/**
 * Get all country codes (lowercase) for static params
 */
export function getStaticCountryCodes(): string[] {
  return staticCountries.map((c) => c.code.toLowerCase());
}
