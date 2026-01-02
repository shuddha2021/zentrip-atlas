import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseMonthSlug, getMonthName, getCanonicalUrl, shouldNoIndex } from "@/lib/seo";
import { formatTempRangeC } from "@/lib/units";

interface PageProps {
  params: Promise<{ month: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month: monthSlug } = await params;
  const month = parseMonthSlug(monthSlug);
  
  if (!month) {
    return { title: "Not Found | ZenTrip Atlas" };
  }
  
  const monthName = getMonthName(month);
  const title = `Where to Go in ${monthName} | Best Travel Destinations | ZenTrip Atlas`;
  const description = `Discover the best travel destinations to visit in ${monthName}. Real climate data, travel scores, and recommendations for US travelers.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/where-to-go-in/${month}`),
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

// Generate static params for all 12 months
export async function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({
    month: String(i + 1),
  }));
}

export default async function WhereToGoInMonthPage({ params }: PageProps) {
  const { month: monthSlug } = await params;
  const month = parseMonthSlug(monthSlug);
  
  if (!month) {
    notFound();
  }
  
  const monthName = getMonthName(month);
  
  // Fetch top destinations for this month
  const climates = await prisma.climate.findMany({
    where: { month },
    orderBy: { score: "desc" },
    take: 12,
    include: { country: true },
  });
  
  // FAQ content
  const faqs = [
    {
      question: `What are the best places to visit in ${monthName}?`,
      answer: `Based on climate data, the top destinations in ${monthName} include ${climates.slice(0, 3).map(c => c.country.name).join(", ")}. These locations offer favorable weather conditions and comfortable temperatures for travelers.`,
    },
    {
      question: `Is ${monthName} a good time to travel internationally?`,
      answer: `${monthName} can be an excellent time to travel depending on your destination. Our data shows several countries with high travel scores during this month, indicating pleasant weather and manageable crowd levels.`,
    },
    {
      question: `How do I find cheap flights in ${monthName}?`,
      answer: `To find affordable flights in ${monthName}, consider destinations with lower crowd levels (which often correlate with lower prices), book in advance, and be flexible with your travel dates.`,
    },
    {
      question: `What should I pack for traveling in ${monthName}?`,
      answer: `Packing depends on your destination. Check the temperature ranges and rainfall data for your chosen country. Generally, layers work well for varying climates.`,
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
          <span className="text-slate-700">Where to Go in {monthName}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Where to Go in {monthName}
        </h1>
        
        <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-3xl">
          Discover the best travel destinations for {monthName}. Our recommendations 
          are based on real climate data, considering temperature, rainfall, crowd 
          levels, and overall travel conditions for US travelers.
        </p>

        {/* Month Navigation */}
        <div className="flex flex-wrap gap-2 mb-10">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <Link
              key={m}
              href={`/where-to-go-in/${m}`}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                m === month
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {getMonthName(m).substring(0, 3)}
            </Link>
          ))}
        </div>

        {/* Destinations Grid */}
        {climates.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {climates.map((climate, index) => (
              <Link
                key={climate.id}
                href={`/country/${climate.countryCode}?month=${month}`}
                className="group bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {climate.country.name}
                    </h2>
                    <p className="text-sm text-slate-500">{climate.country.region}</p>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                    {climate.score}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-600">
                    <span className="text-rose-600 font-medium">
                      {formatTempRangeC(climate.tempMinF, climate.tempMaxF)}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <span className="text-blue-600 font-medium">{climate.rainMm}mm</span> rain
                  </div>
                  <div className="text-slate-600 capitalize">
                    {climate.crowdLevel} crowds
                  </div>
                  <div className="text-emerald-600 font-medium">
                    {climate.budgetTier}
                  </div>
                </div>
                
                {index < 3 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                      #{index + 1} Top Pick
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500 mb-12">
            No destination data available for {monthName}. Check back soon!
          </div>
        )}

        {/* Internal Links */}
        <div className="bg-slate-50/80 rounded-2xl p-6 mb-12">
          <h2 className="font-semibold text-slate-800 mb-4">Explore More</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/explorer"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Browse all destinations →
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/about"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              How we calculate scores →
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 md:p-8">
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
