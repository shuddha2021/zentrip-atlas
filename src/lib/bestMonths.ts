import { prisma } from "@/lib/db";
import { fToC } from "@/lib/units";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface MonthRanking {
  month: number;
  monthName: string;
  score: number;
  reason: string;
}

interface BestMonthsResult {
  best: MonthRanking[];
  avoid: MonthRanking[];
}

/**
 * Generate a calm, descriptive reason for why a month is good or bad to visit.
 */
function generateReason(climate: {
  score: number;
  tempMinF: number;
  tempMaxF: number;
  rainMm: number;
  crowdLevel: string;
}, isGood: boolean): string {
  const avgTempC = Math.round(fToC((climate.tempMinF + climate.tempMaxF) / 2));
  const isWarm = avgTempC > 20;
  const isCold = avgTempC < 10;
  const isMild = avgTempC >= 10 && avgTempC <= 20;
  const isRainy = climate.rainMm > 100;
  const isDry = climate.rainMm < 50;
  const isCrowded = climate.crowdLevel === "high";
  const isQuiet = climate.crowdLevel === "low";

  if (isGood) {
    if (isMild && isDry && isQuiet) {
      return "Pleasant temperatures, low rainfall, and fewer crowds.";
    }
    if (isWarm && isDry) {
      return "Warm and dry—ideal conditions for exploring.";
    }
    if (isMild && isQuiet) {
      return "Comfortable weather with a peaceful atmosphere.";
    }
    if (isDry && isQuiet) {
      return "Dry season with minimal tourist crowds.";
    }
    if (isWarm) {
      return "Warm weather perfect for outdoor activities.";
    }
    return "Favorable conditions for travel.";
  } else {
    if (isRainy && isCrowded) {
      return "Peak rainfall and high tourist density.";
    }
    if (isRainy) {
      return "Expect significant rainfall during this period.";
    }
    if (isCrowded && isWarm) {
      return "Peak season—expect crowds and higher prices.";
    }
    if (isCold) {
      return "Cold temperatures may limit outdoor activities.";
    }
    if (isCrowded) {
      return "High tourist season with elevated prices.";
    }
    return "Less favorable conditions for travel.";
  }
}

/**
 * Get best and worst months to visit a country based on climate data.
 */
export async function getBestMonths(countryCode: string): Promise<BestMonthsResult | null> {
  try {
    const climates = await prisma.climate.findMany({
      where: { countryCode },
      orderBy: { month: "asc" },
    });

    if (climates.length === 0) {
      return null;
    }

    // Sort by score to find best and worst
    const sorted = [...climates].sort((a, b) => b.score - a.score);
    
    // Top 3 best months
    const best: MonthRanking[] = sorted.slice(0, 3).map((c) => ({
      month: c.month,
      monthName: MONTHS[c.month - 1],
      score: c.score,
      reason: generateReason(c, true),
    }));

    // Bottom 2 months to avoid (only if score is significantly lower)
    const avoid: MonthRanking[] = sorted
      .slice(-2)
      .filter((c) => c.score < 70) // Only show if actually problematic
      .map((c) => ({
        month: c.month,
        monthName: MONTHS[c.month - 1],
        score: c.score,
        reason: generateReason(c, false),
      }));

    return { best, avoid };
  } catch {
    return null;
  }
}
