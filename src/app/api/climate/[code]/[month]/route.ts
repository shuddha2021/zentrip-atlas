import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ code: string; month: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { code: rawCode, month: rawMonth } = await params;
  const code = rawCode.toUpperCase().trim();
  const month = parseInt(rawMonth, 10);

  if (isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json(
      { error: "Invalid month. Must be 1-12." },
      { status: 400 }
    );
  }

  try {
    const climate = await prisma.climate.findUnique({
      where: { countryCode_month: { countryCode: code, month } },
    });

    if (!climate) {
      return NextResponse.json(
        { error: "Climate data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      month: climate.month,
      score: climate.score,
      tempMinF: climate.tempMinF,
      tempMaxF: climate.tempMaxF,
      rainMm: climate.rainMm,
      crowdLevel: climate.crowdLevel,
      budgetTier: climate.budgetTier,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
