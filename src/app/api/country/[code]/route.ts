import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code: rawCode } = await context.params;
    const code = rawCode.toUpperCase().trim();

    if (!code || code.length < 2) {
      return NextResponse.json(
        { ok: false, error: "INVALID_CODE", message: "Country code must be at least 2 characters" },
        { status: 400 }
      );
    }

    const monthParam = request.nextUrl.searchParams.get("month");
    const month = clamp(monthParam ? parseInt(monthParam, 10) || 12 : 12, 1, 12);

    const country = await prisma.country.findUnique({
      where: { code },
    });

    if (!country) {
      // Diagnostics for 404
      const countryCount = await prisma.country.count();
      const availableCodes = await prisma.country.findMany({
        select: { code: true },
        take: 10,
      });

      return NextResponse.json(
        {
          ok: false,
          error: "COUNTRY_NOT_FOUND",
          code,
          diagnostics: {
            totalCountries: countryCount,
            sampleCodes: availableCodes.map((c) => c.code),
            hint: countryCount === 0 ? "Run: pnpm db:seed" : `Country '${code}' not in database`,
          },
        },
        { status: 404 }
      );
    }

    const climate = await prisma.climate.findUnique({
      where: { countryCode_month: { countryCode: code, month } },
    });

    const places = await prisma.place.findMany({
      where: { countryCode: code },
      orderBy: { name: "asc" },
    });

    if (!climate) {
      // Climate not found for this month
      const availableMonths = await prisma.climate.findMany({
        where: { countryCode: code },
        select: { month: true },
      });

      return NextResponse.json({
        ok: false,
        error: "CLIMATE_NOT_FOUND",
        code,
        month,
        country: {
          code: country.code,
          name: country.name,
          region: country.region,
          tags: country.tags,
        },
        places: places.map((p) => ({
          name: p.name,
          type: p.type,
          shortDescription: p.shortDescription,
        })),
        diagnostics: {
          availableMonths: availableMonths.map((c) => c.month),
          hint: `No climate data for month ${month}. Available months: ${availableMonths.map((c) => c.month).join(", ") || "none"}`,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      country: {
        code: country.code,
        name: country.name,
        region: country.region,
        tags: country.tags,
      },
      profile: {
        month: climate.month,
        score: climate.score,
        tempMinF: climate.tempMinF,
        tempMaxF: climate.tempMaxF,
        rainMm: climate.rainMm,
        crowdLevel: climate.crowdLevel,
        budgetTier: climate.budgetTier,
        highlights: climate.highlights,
      },
      places: places.map((p) => ({
        name: p.name,
        type: p.type,
        shortDescription: p.shortDescription,
      })),
    });
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
