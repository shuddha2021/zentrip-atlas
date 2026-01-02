import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getBestMonths } from "@/lib/bestMonths";
import { getMonthName, getCanonicalUrl, shouldNoIndex } from "@/lib/seo";
import { formatTempRangeC } from "@/lib/units";
import { EmailSignupForm } from "@/components/EmailSignupForm";
import { getStaticCountry } from "@/data/countries.static";

// Force dynamic rendering - avoid build-time DB access
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code: rawCode } = await params;
  const code = (rawCode ?? "").toUpperCase().trim();
  
  if (!code) {
    return { title: "Not Found | ZenTrip Atlas" };
  }
  
  // Use static data for build-time safety - no DB access
  const staticCountry = getStaticCountry(code);
  
  if (!staticCountry) {
    return { title: "Not Found | ZenTrip Atlas" };
  }
  
  const title = `Best Time to Visit ${staticCountry.name} | When to Go | ZenTrip Atlas`;
  const description = `Find the best months to visit ${staticCountry.name}. Complete guide with climate data, temperatures, rainfall, and crowd levels for ${staticCountry.region}.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/best-time-to-visit/${code.toLowerCase()}`),
    },
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
    robots: shouldNoIndex() ? { index: false, follow: false } : undefined,
  };
}

export default async function BestTimeToVisitPage({ params }: PageProps) {
  const { code: rawCode } = await params;
  const code = (rawCode ?? "").toUpperCase().trim();
  
  if (!code) {
    notFound();
  }
  
  // Fetch data with error handling
  let country: { code: string; name: string; region: string; tags: string[] } | null = null;
  let bestMonths: Awaited<ReturnType<typeof getBestMonths>> = null;
  let allClimates: { month: number; score: number; tempMinF: number; tempMaxF: number; rainMm: number; crowdLevel: string; budgetTier: string }[] = [];
  
  try {
    country = await prisma.country.findUnique({ where: { code } });
    
    if (!country) {
      notFound();
    }
    
    bestMonths = await getBestMonths(code);
    
    // Get all climate data for the monthly breakdown
    allClimates = await prisma.climate.findMany({
      where: { countryCode: code },
      orderBy: { month: "asc" },
    });
  } catch (error) {
    // Log error but show friendly message
    console.error("Failed to load destination data:", error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Unable to load destination</h1>
          <p className="text-slate-600 mb-6">We&apos;re having trouble connecting to our database. Please try again.</p>
          <Link href="/explorer" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Explorer
          </Link>
        </div>
      </div>
    );
  }
  
  if (!country) {
    notFound();
  }
  
  // FAQ content
  const faqs = [
    {
      question: `What is the best month to visit ${country.name}?`,
      answer: bestMonths?.best[0]
        ? `The best time to visit ${country.name} is ${bestMonths.best[0].monthName}, with a travel score of ${bestMonths.best[0].score}. ${bestMonths.best[0].reason}`
        : `${country.name} offers year-round travel opportunities. Check our monthly breakdown for specific conditions.`,
    },
    {
      question: `When should I avoid visiting ${country.name}?`,
      answer: bestMonths?.avoid[0]
        ? `Consider avoiding ${bestMonths.avoid.map(m => m.monthName).join(" and ")} if possible. ${bestMonths.avoid[0].reason}`
        : `${country.name} is generally accessible year-round, though some months may have less favorable conditions.`,
    },
    {
      question: `What is the weather like in ${country.name}?`,
      answer: allClimates.length > 0
        ? `Temperatures in ${country.name} typically range from ${formatTempRangeC(Math.min(...allClimates.map(c => c.tempMinF)), Math.max(...allClimates.map(c => c.tempMaxF)))} throughout the year. Rainfall varies by season.`
        : `Weather varies by season. Check our detailed monthly data for specific conditions.`,
    },
    {
      question: `Is ${country.name} expensive to visit?`,
      answer: allClimates[0]
        ? `${country.name} is generally rated as a ${allClimates[0].budgetTier} destination. Costs can vary by season, with peak periods often being more expensive.`
        : `Travel costs vary by season and travel style. Check current conditions for budget planning.`,
    },
  ];
  
  // JSON-LD FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-slate-800 hover:text-slate-600 transition-colors"
          >
            ZenTrip Atlas
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/explorer"
              className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Explorer
            </Link>
            <Link
              href="/saved"
              className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Saved
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/explorer" className="hover:text-slate-700">Destinations</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">Best Time to Visit {country.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Best Time to Visit {country.name}
        </h1>
        
        <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-3xl">
          Plan your trip to {country.name} with confidence. Here&apos;s when to go 
          based on weather, crowds, and overall travel conditions.
        </p>

        {/* Best Months Section */}
        {bestMonths && bestMonths.best.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-5">
              Best Months to Visit
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {bestMonths.best.map((m, index) => (
                <Link
                  key={m.month}
                  href={`/country/${code}?month=${m.month}`}
                  className="group p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/60 hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-emerald-800 group-hover:text-emerald-600">
                      {m.monthName}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 mb-1">
                    {m.score}
                  </div>
                  <p className="text-sm text-emerald-600/80">{m.reason}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Months to Avoid */}
        {bestMonths && bestMonths.avoid.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Months to Consider Avoiding
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {bestMonths.avoid.map((m) => (
                <div
                  key={m.month}
                  className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/60"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-amber-800">
                      {m.monthName}
                    </span>
                    <span className="text-lg font-bold text-amber-600">
                      {m.score}
                    </span>
                  </div>
                  <p className="text-sm text-amber-700/80">{m.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Breakdown */}
        {allClimates.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-5">
              Month-by-Month Breakdown
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 font-semibold text-slate-700">Month</th>
                    <th className="text-center py-3 px-2 font-semibold text-slate-700">Score</th>
                    <th className="text-center py-3 px-2 font-semibold text-slate-700">Temp</th>
                    <th className="text-center py-3 px-2 font-semibold text-slate-700">Rain</th>
                    <th className="text-center py-3 px-2 font-semibold text-slate-700">Crowds</th>
                    <th className="text-center py-3 px-2 font-semibold text-slate-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {allClimates.map((climate) => (
                    <tr key={climate.month} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-3 px-2 font-medium text-slate-800">
                        {getMonthName(climate.month)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`font-bold ${
                          climate.score >= 80 ? "text-emerald-600" :
                          climate.score >= 60 ? "text-amber-600" :
                          "text-slate-500"
                        }`}>
                          {climate.score}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center text-rose-600">
                        {formatTempRangeC(climate.tempMinF, climate.tempMaxF)}
                      </td>
                      <td className="py-3 px-2 text-center text-blue-600">
                        {climate.rainMm}mm
                      </td>
                      <td className="py-3 px-2 text-center text-slate-600 capitalize">
                        {climate.crowdLevel}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Link
                          href={`/country/${code}?month=${climate.month}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Email Signup */}
        <EmailSignupForm 
          sourcePage={`best-time-to-visit-${code.toLowerCase()}`}
          className="mb-8"
        />

        {/* FAQ Section */}
        <section className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold text-slate-700 mb-2">
                  {faq.question}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <div className="bg-slate-50/80 rounded-2xl p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Explore More</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/country/${code}?month=${new Date().getMonth() + 1}`}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View {country.name} for this month →
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/explorer"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Browse all destinations →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} ZenTrip Atlas. Made with calm intention.
          </p>
        </div>
      </footer>
    </div>
  );
}
