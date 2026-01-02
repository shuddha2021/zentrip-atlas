import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export async function GET(request: NextRequest) {
  try {
    const monthParam = request.nextUrl.searchParams.get("month");
    const month = clamp(monthParam ? parseInt(monthParam, 10) || 12 : 12, 1, 12);

    const climates = await prisma.climate.findMany({
      where: { month },
      orderBy: { score: "desc" },
      include: { country: true },
    });

    if (climates.length === 0) {
      // Return diagnostics if no data
      const countryCount = await prisma.country.count();
      const climateCount = await prisma.climate.count();
      const placeCount = await prisma.place.count();

      return NextResponse.json({
        ok: false,
        error: "NO_DATA_FOR_MONTH",
        month,
        diagnostics: {
          totalCountries: countryCount,
          totalClimates: climateCount,
          totalPlaces: placeCount,
          hint: countryCount === 0 ? "Run: pnpm db:seed" : `No climates found for month ${month}`,
        },
      });
    }

    const results = climates.map((c) => ({
      code: c.country.code,
      name: c.country.name,
      region: c.country.region,
      tags: c.country.tags,
      score: c.score,
      tempMinF: c.tempMinF,
      tempMaxF: c.tempMaxF,
      rainMm: c.rainMm,
      crowdLevel: c.crowdLevel,
      budgetTier: c.budgetTier,
      highlights: c.highlights,
    }));

    return NextResponse.json({ ok: true, month, results });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
