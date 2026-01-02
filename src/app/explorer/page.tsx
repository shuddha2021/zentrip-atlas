import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ExplorerClient } from "@/components/ExplorerClient";

// Force dynamic rendering - no DB access at build time
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Explore Destinations | ZenTrip Atlas",
  description:
    "Discover the best travel destinations worldwide. Find your perfect trip with real climate data, travel scores, and curated recommendations for every month.",
  openGraph: {
    title: "Explore Destinations | ZenTrip Atlas",
    description:
      "Discover the best travel destinations worldwide with real climate data and travel scores.",
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<{ month?: string }>;
}

type ClimateWithCountry = Awaited<ReturnType<typeof prisma.climate.findMany<{ include: { country: true } }>>>[number];

export default async function ExplorerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const monthParam = params.month ? parseInt(params.month, 10) : new Date().getMonth() + 1;
  const month = Math.max(1, Math.min(12, isNaN(monthParam) ? 1 : monthParam));

  let climates: ClimateWithCountry[] = [];
  let error: string | null = null;
  let diagnostics: { totalCountries: number; totalClimates: number; totalPlaces: number } | null = null;

  try {
    climates = await prisma.climate.findMany({
      where: { month },
      orderBy: { score: "desc" },
      include: { country: true },
    });

    if (climates.length === 0) {
      const [countryCount, climateCount, placeCount] = await Promise.all([
        prisma.country.count(),
        prisma.climate.count(),
        prisma.place.count(),
      ]);
      diagnostics = { totalCountries: countryCount, totalClimates: climateCount, totalPlaces: placeCount };
      error = "NO_DATA";
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Database error";
  }

  // Error state with diagnostics
  if (error) {
    return (
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/" 
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            ← Home
          </Link>
          
          <div className="zen-card p-8 mt-6">
            <h2 className="text-xl font-medium text-[var(--text-primary)] mb-3">No data found</h2>
            <p className="text-[var(--text-secondary)] mb-4">{error}</p>
            
            {diagnostics && (
              <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-sm">
                <p className="font-medium text-[var(--text-primary)] mb-2">Diagnostics</p>
                <ul className="space-y-1 text-[var(--text-secondary)]">
                  <li>Countries: {diagnostics.totalCountries}</li>
                  <li>Climates: {diagnostics.totalClimates}</li>
                  <li>Places: {diagnostics.totalPlaces}</li>
                </ul>
                {diagnostics.totalCountries === 0 && (
                  <div className="mt-4 p-3 bg-[var(--lavender)] rounded-lg">
                    <p className="font-medium text-[var(--text-primary)]">Database is empty</p>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">
                      Run: <code className="bg-white px-1.5 py-0.5 rounded">pnpm db:seed</code>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Transform data for client component
  const climateData = climates.map((c) => ({
    countryCode: c.countryCode,
    score: c.score,
    tempMinF: c.tempMinF,
    tempMaxF: c.tempMaxF,
    rainMm: c.rainMm,
    crowdLevel: c.crowdLevel,
    budgetTier: c.budgetTier,
    country: {
      code: c.country.code,
      name: c.country.name,
      region: c.country.region,
      tags: c.country.tags,
    },
  }));

  return <ExplorerClient climates={climateData} currentMonth={month} />;
}
