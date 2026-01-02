import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 24 countries with tags and base climate profiles
const countries = [
  { code: "ES", name: "Spain", region: "Europe", tags: ["beach", "culture", "food", "nightlife"], hemisphere: "N" as const, baseTemp: 60, seasonality: 25 },
  { code: "IT", name: "Italy", region: "Europe", tags: ["culture", "food", "history", "romance"], hemisphere: "N" as const, baseTemp: 55, seasonality: 28 },
  { code: "FR", name: "France", region: "Europe", tags: ["culture", "food", "romance", "wine"], hemisphere: "N" as const, baseTemp: 50, seasonality: 30 },
  { code: "PT", name: "Portugal", region: "Europe", tags: ["beach", "surf", "wine", "history"], hemisphere: "N" as const, baseTemp: 62, seasonality: 18 },
  { code: "GR", name: "Greece", region: "Europe", tags: ["beach", "history", "islands", "food"], hemisphere: "N" as const, baseTemp: 65, seasonality: 25 },
  { code: "TH", name: "Thailand", region: "Asia", tags: ["beach", "temples", "food", "budget"], hemisphere: "N" as const, baseTemp: 82, seasonality: 8 },
  { code: "JP", name: "Japan", region: "Asia", tags: ["culture", "food", "temples", "modern"], hemisphere: "N" as const, baseTemp: 55, seasonality: 35 },
  { code: "VN", name: "Vietnam", region: "Asia", tags: ["food", "history", "budget", "nature"], hemisphere: "N" as const, baseTemp: 78, seasonality: 12 },
  { code: "ID", name: "Indonesia", region: "Asia", tags: ["beach", "surf", "temples", "nature"], hemisphere: "S" as const, baseTemp: 82, seasonality: 5 },
  { code: "AU", name: "Australia", region: "Oceania", tags: ["beach", "nature", "adventure", "wildlife"], hemisphere: "S" as const, baseTemp: 72, seasonality: 20 },
  { code: "NZ", name: "New Zealand", region: "Oceania", tags: ["nature", "adventure", "film", "hiking"], hemisphere: "S" as const, baseTemp: 58, seasonality: 18 },
  { code: "MX", name: "Mexico", region: "Americas", tags: ["beach", "culture", "food", "history"], hemisphere: "N" as const, baseTemp: 75, seasonality: 12 },
  { code: "BR", name: "Brazil", region: "Americas", tags: ["beach", "carnival", "nature", "adventure"], hemisphere: "S" as const, baseTemp: 78, seasonality: 15 },
  { code: "AR", name: "Argentina", region: "Americas", tags: ["wine", "tango", "steak", "nature"], hemisphere: "S" as const, baseTemp: 62, seasonality: 22 },
  { code: "CO", name: "Colombia", region: "Americas", tags: ["coffee", "salsa", "nature", "culture"], hemisphere: "N" as const, baseTemp: 72, seasonality: 5 },
  { code: "PE", name: "Peru", region: "Americas", tags: ["history", "food", "nature", "adventure"], hemisphere: "S" as const, baseTemp: 65, seasonality: 12 },
  { code: "MA", name: "Morocco", region: "Africa", tags: ["culture", "desert", "food", "markets"], hemisphere: "N" as const, baseTemp: 68, seasonality: 22 },
  { code: "ZA", name: "South Africa", region: "Africa", tags: ["wildlife", "wine", "nature", "adventure"], hemisphere: "S" as const, baseTemp: 68, seasonality: 18 },
  { code: "EG", name: "Egypt", region: "Africa", tags: ["history", "pyramids", "desert", "diving"], hemisphere: "N" as const, baseTemp: 75, seasonality: 25 },
  { code: "KE", name: "Kenya", region: "Africa", tags: ["safari", "wildlife", "nature", "beach"], hemisphere: "S" as const, baseTemp: 72, seasonality: 8 },
  { code: "AE", name: "UAE", region: "Middle East", tags: ["luxury", "modern", "shopping", "desert"], hemisphere: "N" as const, baseTemp: 85, seasonality: 22 },
  { code: "TR", name: "Turkey", region: "Middle East", tags: ["culture", "food", "history", "beach"], hemisphere: "N" as const, baseTemp: 58, seasonality: 30 },
  { code: "HR", name: "Croatia", region: "Europe", tags: ["beach", "islands", "history", "sailing"], hemisphere: "N" as const, baseTemp: 55, seasonality: 28 },
  { code: "IS", name: "Iceland", region: "Europe", tags: ["nature", "adventure", "northern-lights", "hiking"], hemisphere: "N" as const, baseTemp: 38, seasonality: 18 },
];

// Rainfall patterns by region and month (1-12)
const rainfallPatterns: Record<string, number[]> = {
  "Europe": [60, 50, 55, 50, 55, 45, 30, 35, 50, 70, 75, 70],
  "Asia": [20, 25, 40, 80, 150, 180, 200, 190, 150, 100, 50, 25],
  "Oceania": [80, 90, 70, 60, 70, 80, 70, 60, 60, 70, 70, 80],
  "Americas": [40, 35, 45, 60, 90, 120, 150, 140, 120, 80, 50, 40],
  "Africa": [30, 35, 50, 70, 40, 20, 10, 15, 25, 40, 50, 35],
  "Middle East": [25, 30, 25, 15, 5, 0, 0, 0, 5, 15, 25, 30],
};

// Crowd patterns by month (peak = summer for N hemisphere destinations, winter holidays)
const crowdPatterns = {
  N: ["low", "low", "medium", "medium", "high", "high", "high", "high", "medium", "medium", "low", "medium"] as const,
  S: ["high", "high", "medium", "medium", "low", "low", "low", "low", "medium", "medium", "high", "high"] as const,
};

// Budget patterns (higher in peak season)
const budgetPatterns = {
  N: ["$", "$", "$$", "$$", "$$$", "$$$", "$$$", "$$$", "$$", "$$", "$", "$$"] as const,
  S: ["$$$", "$$$", "$$", "$$", "$", "$", "$", "$", "$$", "$$", "$$$", "$$$"] as const,
};

// Monthly highlights templates
const monthlyHighlights: Record<number, string[]> = {
  1: ["New Year celebrations", "Winter escapes", "Off-peak deals"],
  2: ["Valentine's retreats", "Carnival season", "Shoulder season"],
  3: ["Spring awakening", "Cherry blossoms", "Pre-summer prices"],
  4: ["Easter holidays", "Spring festivals", "Pleasant weather"],
  5: ["Late spring bloom", "Outdoor activities", "Before summer crowds"],
  6: ["Summer begins", "Long sunny days", "Festival season"],
  7: ["Peak summer", "Beach weather", "Outdoor adventures"],
  8: ["High season", "Perfect for swimming", "Cultural festivals"],
  9: ["Harvest season", "Mild temperatures", "Wine festivals"],
  10: ["Autumn colors", "Halloween events", "Shoulder season"],
  11: ["Pre-winter calm", "Off-peak travel", "Local experiences"],
  12: ["Holiday magic", "Christmas markets", "Winter wonderland"],
};

/**
 * Calculate temperature for a given month based on hemisphere and seasonality
 */
function calcTemp(baseTemp: number, seasonality: number, month: number, hemisphere: "N" | "S"): { min: number; max: number } {
  // Month 1 = Jan, 7 = July
  // For N hemisphere: coldest in Jan, warmest in July
  // For S hemisphere: opposite
  const peakMonth = hemisphere === "N" ? 7 : 1;
  const monthOffset = Math.abs(month - peakMonth);
  const seasonFactor = Math.cos((monthOffset / 6) * Math.PI); // -1 to 1
  
  const tempOffset = seasonality * seasonFactor;
  const avgTemp = baseTemp + tempOffset;
  
  return {
    min: Math.round(avgTemp - 12),
    max: Math.round(avgTemp + 8),
  };
}

/**
 * Calculate travel score based on temperature, rain, and crowds
 */
function calcScore(tempMax: number, rainMm: number, crowdLevel: string): number {
  let score = 70; // base score
  
  // Temperature factor (ideal: 68-82°F)
  if (tempMax >= 68 && tempMax <= 82) {
    score += 15;
  } else if (tempMax >= 60 && tempMax <= 90) {
    score += 8;
  } else if (tempMax < 45 || tempMax > 95) {
    score -= 10;
  }
  
  // Rain factor
  if (rainMm < 30) score += 10;
  else if (rainMm < 60) score += 5;
  else if (rainMm > 150) score -= 10;
  else if (rainMm > 100) score -= 5;
  
  // Crowd factor (lower crowds = slightly better for some travelers)
  if (crowdLevel === "low") score += 3;
  else if (crowdLevel === "high") score -= 2;
  
  // Clamp to 40-98
  return Math.max(40, Math.min(98, score));
}

/**
 * Generate all climate data for all countries and all 12 months
 */
function generateClimateData() {
  const climates: Array<{
    countryCode: string;
    month: number;
    score: number;
    tempMinF: number;
    tempMaxF: number;
    rainMm: number;
    crowdLevel: string;
    budgetTier: string;
    highlights: string[];
  }> = [];

  for (const country of countries) {
    const hemisphere = country.hemisphere;
    const rainPattern = rainfallPatterns[country.region] || rainfallPatterns["Europe"];

    for (let month = 1; month <= 12; month++) {
      const temps = calcTemp(country.baseTemp, country.seasonality, month, hemisphere);
      const rainMm = Math.round(rainPattern[month - 1] * (0.8 + Math.sin(country.code.charCodeAt(0)) * 0.4));
      const crowdLevel = crowdPatterns[hemisphere][month - 1];
      const budgetTier = budgetPatterns[hemisphere][month - 1];
      const score = calcScore(temps.max, rainMm, crowdLevel);

      climates.push({
        countryCode: country.code,
        month,
        score,
        tempMinF: temps.min,
        tempMaxF: temps.max,
        rainMm: Math.max(5, rainMm),
        crowdLevel,
        budgetTier,
        highlights: monthlyHighlights[month],
      });
    }
  }

  return climates;
}

// Places for Spain (ES) - complete set
const spainPlaces = [
  { countryCode: "ES", name: "La Sagrada Familia", type: "landmark", shortDescription: "Gaudí's unfinished masterpiece basilica in Barcelona" },
  { countryCode: "ES", name: "Alhambra", type: "landmark", shortDescription: "Stunning Moorish palace complex in Granada" },
  { countryCode: "ES", name: "Park Güell", type: "park", shortDescription: "Colorful Gaudí-designed public park in Barcelona" },
  { countryCode: "ES", name: "Prado Museum", type: "museum", shortDescription: "World-class art museum in Madrid" },
  { countryCode: "ES", name: "Plaza Mayor", type: "square", shortDescription: "Historic central square in Madrid" },
  { countryCode: "ES", name: "La Rambla", type: "street", shortDescription: "Famous tree-lined pedestrian street in Barcelona" },
  { countryCode: "ES", name: "Ibiza Old Town", type: "neighborhood", shortDescription: "UNESCO World Heritage walled city" },
];

// Sample places for other countries (1-2 each)
const otherPlaces = [
  { countryCode: "IT", name: "Colosseum", type: "landmark", shortDescription: "Ancient Roman amphitheater in Rome" },
  { countryCode: "IT", name: "Venice Canals", type: "attraction", shortDescription: "Iconic waterways of Venice" },
  { countryCode: "FR", name: "Eiffel Tower", type: "landmark", shortDescription: "Iconic iron lattice tower in Paris" },
  { countryCode: "FR", name: "Louvre Museum", type: "museum", shortDescription: "World's largest art museum" },
  { countryCode: "PT", name: "Belém Tower", type: "landmark", shortDescription: "16th-century fortified tower in Lisbon" },
  { countryCode: "GR", name: "Acropolis", type: "landmark", shortDescription: "Ancient citadel above Athens" },
  { countryCode: "TH", name: "Grand Palace", type: "landmark", shortDescription: "Royal palace complex in Bangkok" },
  { countryCode: "TH", name: "Phi Phi Islands", type: "beach", shortDescription: "Stunning island archipelago" },
  { countryCode: "JP", name: "Fushimi Inari Shrine", type: "temple", shortDescription: "Famous shrine with thousands of torii gates" },
  { countryCode: "JP", name: "Mount Fuji", type: "nature", shortDescription: "Japan's iconic sacred mountain" },
  { countryCode: "VN", name: "Ha Long Bay", type: "nature", shortDescription: "UNESCO World Heritage seascape" },
  { countryCode: "ID", name: "Bali Beaches", type: "beach", shortDescription: "World-famous tropical beaches" },
  { countryCode: "AU", name: "Sydney Opera House", type: "landmark", shortDescription: "Iconic performing arts venue" },
  { countryCode: "AU", name: "Great Barrier Reef", type: "nature", shortDescription: "World's largest coral reef system" },
  { countryCode: "NZ", name: "Milford Sound", type: "nature", shortDescription: "Stunning fiord in South Island" },
  { countryCode: "MX", name: "Chichen Itza", type: "landmark", shortDescription: "Ancient Mayan pyramid complex" },
  { countryCode: "MX", name: "Cancun Beaches", type: "beach", shortDescription: "Caribbean beach paradise" },
  { countryCode: "BR", name: "Christ the Redeemer", type: "landmark", shortDescription: "Iconic statue overlooking Rio" },
  { countryCode: "AR", name: "Iguazu Falls", type: "nature", shortDescription: "Spectacular waterfall system" },
  { countryCode: "CO", name: "Cartagena Old Town", type: "neighborhood", shortDescription: "Colonial walled city on the coast" },
  { countryCode: "PE", name: "Machu Picchu", type: "landmark", shortDescription: "Ancient Incan citadel" },
  { countryCode: "MA", name: "Jemaa el-Fnaa", type: "square", shortDescription: "Vibrant main square in Marrakech" },
  { countryCode: "ZA", name: "Table Mountain", type: "nature", shortDescription: "Iconic flat-topped mountain in Cape Town" },
  { countryCode: "EG", name: "Pyramids of Giza", type: "landmark", shortDescription: "Ancient wonder of the world" },
  { countryCode: "KE", name: "Maasai Mara", type: "nature", shortDescription: "Famous safari reserve" },
  { countryCode: "AE", name: "Burj Khalifa", type: "landmark", shortDescription: "World's tallest building in Dubai" },
  { countryCode: "TR", name: "Hagia Sophia", type: "landmark", shortDescription: "Historic mosque in Istanbul" },
  { countryCode: "HR", name: "Dubrovnik Old Town", type: "neighborhood", shortDescription: "Medieval walled city on the Adriatic" },
  { countryCode: "IS", name: "Blue Lagoon", type: "attraction", shortDescription: "Geothermal spa near Reykjavik" },
];

async function main() {
  console.log("Starting seed...");

  // Upsert countries (without climate-related fields)
  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: { name: country.name, region: country.region, tags: country.tags },
      create: { code: country.code, name: country.name, region: country.region, tags: country.tags },
    });
  }
  console.log(`Upserted ${countries.length} countries`);

  // Generate and upsert all climate data (24 countries × 12 months = 288 rows)
  const allClimates = generateClimateData();
  for (const climate of allClimates) {
    await prisma.climate.upsert({
      where: { countryCode_month: { countryCode: climate.countryCode, month: climate.month } },
      update: {
        score: climate.score,
        tempMinF: climate.tempMinF,
        tempMaxF: climate.tempMaxF,
        rainMm: climate.rainMm,
        crowdLevel: climate.crowdLevel,
        budgetTier: climate.budgetTier,
        highlights: climate.highlights,
      },
      create: climate,
    });
  }
  console.log(`Upserted ${allClimates.length} climates (24 countries × 12 months)`);

  // Delete existing places and insert fresh
  await prisma.place.deleteMany({});
  const allPlaces = [...spainPlaces, ...otherPlaces];
  await prisma.place.createMany({ data: allPlaces });
  console.log(`Inserted ${allPlaces.length} places`);

  // Final counts
  const countryCount = await prisma.country.count();
  const climateCount = await prisma.climate.count();
  const placeCount = await prisma.place.count();

  console.log(`Seed complete: ${countryCount} countries, ${climateCount} climates, ${placeCount} places`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
