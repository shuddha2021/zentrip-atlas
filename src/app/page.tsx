import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(224,231,255,0.35)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-teal-100/25 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-2xl text-center relative z-10">
        {/* Premium title */}
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          ZenTrip Atlas
        </h1>
        
        {/* Tagline with stronger contrast */}
        <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto">
          Discover the perfect travel destination for every month of the year.
          Curated climate data, top attractions, and insider tips.
        </p>
        
        {/* Premium CTA button */}
        <Link
          href="/explorer"
          className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
        >
          Open Explorer
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        
        {/* Secondary links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          <span className="text-slate-500">
            Or try:{" "}
            <Link
              href="/country/ES?month=6"
              className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors"
            >
              Spain in June
            </Link>
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <Link
            href="/saved"
            className="text-slate-500 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            View Saved Trips
          </Link>
        </div>
      </div>
    </div>
  );
}
