import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | ZenTrip Atlas",
  description:
    "ZenTrip Atlas helps you discover the perfect travel destinations with real climate data and thoughtful recommendations. Plan your next adventure with calm confidence.",
  openGraph: {
    title: "About | ZenTrip Atlas",
    description:
      "Discover the perfect travel destinations with real climate data and thoughtful recommendations.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
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

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
          About ZenTrip Atlas
        </h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            ZenTrip Atlas helps you discover your next destination with calm
            confidence. We combine real climate data with thoughtful
            recommendations to help you find the perfect time and place for your
            next adventure.
          </p>

          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Our Philosophy
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Travel planning should be a joy, not a chore. We believe in
              presenting information clearly and calmly, without overwhelming
              you with endless options or aggressive sales pitches.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Every destination in ZenTrip Atlas is scored based on real weather
              data, safety considerations, and travel accessibility—giving you
              an honest picture of what to expect each month.
            </p>
          </section>

          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              How It Works
            </h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong className="text-slate-700">Choose a month</strong> –
                  Pick when you want to travel, and we&apos;ll show you the best
                  destinations for that time.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong className="text-slate-700">Explore countries</strong>{" "}
                  – See climate scores, temperature ranges, and what makes each
                  destination special.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong className="text-slate-700">Save your favorites</strong>{" "}
                  – Build a shortlist of destinations you&apos;re considering.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  <strong className="text-slate-700">Plan with confidence</strong>{" "}
                  – Use our cost estimates and best-month recommendations to
                  finalize your trip.
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Data &amp; Transparency
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our travel scores are calculated using historical climate data,
              including temperature, rainfall, and seasonal patterns. Cost
              estimates are based on typical budget ranges for each destination
              and are meant as general guidance only.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We may earn a small commission when you book through our partner
              links. This helps us keep ZenTrip Atlas free and ad-light. We only
              recommend partners we trust.
            </p>
          </section>

          <div className="text-center pt-4">
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors shadow-sm"
            >
              Start Exploring
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} ZenTrip Atlas. Made with calm intention.
          </p>
        </div>
      </footer>
    </div>
  );
}
