import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatTempRangeC } from "@/lib/units";
import { CountrySaveButton } from "@/components/CountrySaveButton";
import { BestMonthsSection } from "@/components/BestMonthsSection";
import { AffiliateCTAs } from "@/components/AffiliateCTAs";
import { CostOverview } from "@/components/CostOverview";
import { CompareMonths } from "@/components/CompareMonths";
import { ShareButton } from "@/components/ShareButton";
import { getBestMonths } from "@/lib/bestMonths";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ month?: string }>;
}

// Dynamic SEO metadata with OG image support
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase().trim();
  
  try {
    const country = await prisma.country.findUnique({ where: { code } });
    if (country) {
      const title = `${country.name} Travel Guide | ZenTrip Atlas`;
      const description = `Discover the best time to visit ${country.name}. Climate data, top attractions, and travel tips for ${country.region}.`;
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: "website",
          siteName: "ZenTrip Atlas",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
        },
      };
    }
  } catch {
    // Fall through to default
  }
  
  return {
    title: "Country Guide | ZenTrip Atlas",
    description: "Explore travel destinations with ZenTrip Atlas.",
  };
}

export default async function CountryPage({ params, searchParams }: PageProps) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase().trim();
  const sp = await searchParams;
  const monthParam = sp.month ? parseInt(sp.month, 10) : 12;
  const month = Math.max(1, Math.min(12, isNaN(monthParam) ? 12 : monthParam));

  // Always render shell - never blank
  let country: Awaited<ReturnType<typeof prisma.country.findUnique>> = null;
  let climate: Awaited<ReturnType<typeof prisma.climate.findUnique>> = null;
  let places: Awaited<ReturnType<typeof prisma.place.findMany>> = [];
  let bestMonths: Awaited<ReturnType<typeof getBestMonths>> = null;
  let error: string | null = null;
  let diagnostics: Record<string, unknown> | null = null;

  try {
    country = await prisma.country.findUnique({ where: { code } });

    if (!country) {
      const countryCount = await prisma.country.count();
      const sampleCodes = await prisma.country.findMany({ select: { code: true }, take: 10 });
      diagnostics = {
        totalCountries: countryCount,
        sampleCodes: sampleCodes.map(c => c.code),
        hint: countryCount === 0 ? "Database is empty. Run: pnpm db:seed" : `Country '${code}' not found`,
      };
      error = "COUNTRY_NOT_FOUND";
    } else {
      [climate, places, bestMonths] = await Promise.all([
        prisma.climate.findUnique({
          where: { countryCode_month: { countryCode: code, month } },
        }),
        prisma.place.findMany({
          where: { countryCode: code },
          orderBy: { name: "asc" },
        }),
        getBestMonths(code),
      ]);

      if (!climate) {
        const availableMonths = await prisma.climate.findMany({
          where: { countryCode: code },
          select: { month: true },
        });
        diagnostics = {
          availableMonths: availableMonths.map(c => c.month),
          hint: `No climate data for ${MONTHS[month - 1]}. Available: ${availableMonths.map(c => MONTHS[c.month - 1]).join(", ") || "none"}`,
        };
        error = "CLIMATE_NOT_FOUND";
      }
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Database error";
  }

  // 404 for country not found
  if (error === "COUNTRY_NOT_FOUND") {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white/90 border border-red-200 rounded-2xl p-8 shadow-md">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Country Not Found</h1>
          <p className="text-red-700 mb-4">
            Could not find country with code: <strong>{code}</strong>
          </p>
          {diagnostics && (
            <div className="bg-red-50/50 rounded-xl p-4 text-sm font-mono text-slate-600 mb-4 border border-red-100">
              <p className="font-semibold text-slate-700">Diagnostics:</p>
              <pre className="mt-2 overflow-x-auto">{JSON.stringify(diagnostics, null, 2)}</pre>
            </div>
          )}
          <Link
            href="/explorer"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            ← Back to Explorer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link 
          href={`/explorer?month=${month}`} 
          className="text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 inline-flex items-center gap-1 transition-colors"
        >
          <span>←</span> Back to Explorer
        </Link>

        {/* Hero Card - Country Header */}
        {country && (
          <div className="bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-8 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
                  {country.name}
                </h1>
                <p className="text-indigo-600 font-semibold text-lg mb-4">{country.region}</p>
                <div className="flex flex-wrap gap-2">
                  {country.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sm:text-right flex flex-col items-end gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Viewing</p>
                  <p className="text-xl font-bold text-teal-600">{MONTHS[month - 1]}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton />
                  <CountrySaveButton code={country.code} name={country.name} region={country.region} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Climate Error */}
        {error === "CLIMATE_NOT_FOUND" && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-amber-800 mb-2">
              No Climate Data for {MONTHS[month - 1]}
            </h2>
            {diagnostics && (
              <div className="bg-white/80 rounded-lg p-4 text-sm font-mono text-slate-600 border border-amber-100">
                <pre className="overflow-x-auto">{JSON.stringify(diagnostics, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Database Error */}
        {error && error !== "CLIMATE_NOT_FOUND" && error !== "COUNTRY_NOT_FOUND" && (
          <div className="bg-red-50/80 border border-red-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* At a Glance - Stats Row */}
        {climate && (
          <div className="bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-5">
              At a Glance — {MONTHS[month - 1]}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Score */}
              <div className="zen-stat zen-stat-score rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-700">{climate.score}</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-amber-600/80 mt-1">Travel Score</div>
              </div>
              {/* Temperature */}
              <div className="zen-stat zen-stat-temp rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-rose-700">
                  {formatTempRangeC(climate.tempMinF, climate.tempMaxF)}
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-rose-600/80 mt-1">Temperature</div>
              </div>
              {/* Rainfall */}
              <div className="zen-stat zen-stat-rain rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-blue-700">{climate.rainMm}mm</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-blue-600/80 mt-1">Rainfall</div>
              </div>
              {/* Budget */}
              <div className="zen-stat zen-stat-budget rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-emerald-700">{climate.budgetTier}</div>
                <div className="text-xs uppercase tracking-wider font-semibold text-emerald-600/80 mt-1">Budget Tier</div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-slate-200/60">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 capitalize">
                  {climate.crowdLevel} crowds
                </span>
              </div>
            </div>

            {climate.highlights.length > 0 && (
              <div className="mt-5 pt-5 border-t border-slate-200/60">
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Highlights</h3>
                <ul className="space-y-2">
                  {climate.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="text-teal-500 font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Compare Months */}
        {country && climate && (
          <CompareMonths
            countryCode={country.code}
            countryName={country.name}
            currentMonth={month}
            currentClimate={{
              month: climate.month,
              score: climate.score,
              tempMinF: climate.tempMinF,
              tempMaxF: climate.tempMaxF,
              rainMm: climate.rainMm,
              crowdLevel: climate.crowdLevel,
              budgetTier: climate.budgetTier,
            }}
          />
        )}

        {/* Places to Visit */}
        {places.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-5">
              Top Places to Visit
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="p-5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                >
                  <h3 className="font-semibold text-slate-800">{place.name}</h3>
                  <p className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mt-1 mb-2">
                    {place.type}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {place.shortDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Months to Visit */}
        {country && bestMonths && (
          <BestMonthsSection
            best={bestMonths.best}
            avoid={bestMonths.avoid}
            countryName={country.name}
          />
        )}

        {/* Cost Overview */}
        {country && climate && (
          <CostOverview
            budgetTier={climate.budgetTier}
            countryName={country.name}
          />
        )}

        {/* Plan Your Trip - Affiliate CTAs */}
        {country && climate && (
          <AffiliateCTAs
            countryCode={country.code}
            countryName={country.name}
            month={month}
            monthName={MONTHS[month - 1]}
          />
        )}

        {/* No places fallback */}
        {places.length === 0 && country && (
          <div className="bg-white/90 border border-black/[0.06] rounded-2xl p-8 text-center text-slate-500 shadow-sm">
            No places found for {country.name}. Consider adding more seed data.
          </div>
        )}
      </div>
    </div>
  );
}
