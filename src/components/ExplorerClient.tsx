"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatTempRangeC } from "@/lib/units";
import { SaveButton } from "@/components/SaveButton";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const REGIONS = ["All", "Europe", "Asia", "Americas", "Africa", "Oceania", "Middle East"] as const;
const CROWDS = ["All", "low", "medium", "high"] as const;

type Region = typeof REGIONS[number];
type Crowd = typeof CROWDS[number];

interface ClimateData {
  countryCode: string;
  score: number;
  tempMinF: number;
  tempMaxF: number;
  rainMm: number;
  crowdLevel: string;
  budgetTier: string;
  country: {
    code: string;
    name: string;
    region: string;
    tags: string[];
  };
}

interface ExplorerClientProps {
  climates: ClimateData[];
  currentMonth: number;
}

export function ExplorerClient({ climates, currentMonth }: ExplorerClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [region, setRegion] = useState<Region>("All");
  const [crowd, setCrowd] = useState<Crowd>("All");

  const handleMonthChange = (newMonth: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(newMonth));
    router.push(`/explorer?${params.toString()}`);
  };

  const filteredClimates = useMemo(() => {
    return climates.filter((c) => {
      if (region !== "All" && c.country.region !== region) return false;
      if (crowd !== "All" && c.crowdLevel !== crowd) return false;
      return true;
    });
  }, [climates, region, crowd]);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors font-medium"
          >
            ← Home
          </Link>
          <Link 
            href="/saved" 
            className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Saved
          </Link>
        </div>

        {/* Top bar */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Explore destinations
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Showing <span className="font-semibold text-slate-700">{filteredClimates.length}</span> places for{" "}
              <span className="font-semibold text-indigo-600">{MONTHS_FULL[currentMonth - 1]}</span>
            </p>
          </div>
          
          {/* Month picker */}
          <div className="flex items-center gap-1 bg-white/80 border border-black/[0.06] rounded-xl p-1.5 overflow-x-auto shadow-sm">
            {MONTHS.map((name, idx) => (
              <button
                key={idx}
                onClick={() => handleMonthChange(idx + 1)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 ${
                  currentMonth === idx + 1
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200 ring-2 ring-indigo-500/20 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Region filter */}
          <div className="flex items-center gap-1 bg-white/80 border border-black/[0.06] rounded-xl p-1 shadow-sm">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 ${
                  region === r
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Crowd filter */}
          <div className="flex items-center gap-1 bg-white/80 border border-black/[0.06] rounded-xl p-1 shadow-sm">
            {CROWDS.map((c) => (
              <button
                key={c}
                onClick={() => setCrowd(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 ${
                  crowd === c
                    ? "bg-teal-50 text-teal-700 border border-teal-200 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
                }`}
              >
                {c === "All" ? "All crowds" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {filteredClimates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClimates.map((climate) => (
              <Link
                key={climate.countryCode}
                href={`/country/${climate.countryCode}?month=${currentMonth}`}
                className="group bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-black/[0.10] hover:-translate-y-1 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">
                      {climate.country.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {climate.country.region}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SaveButton
                      country={{ code: climate.country.code, name: climate.country.name, region: climate.country.region }}
                      compact
                    />
                    {/* Premium score badge */}
                    <div className="score-badge">
                      {climate.score}
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-xs mb-4 py-3 border-y border-slate-100">
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="text-rose-500">🌡</span>
                    <span className="font-medium">{formatTempRangeC(climate.tempMinF, climate.tempMaxF)}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="text-blue-500">💧</span>
                    <span className="font-medium">{climate.rainMm}mm</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-600 capitalize">
                    <span className="text-amber-500">👥</span>
                    <span className="font-medium">{climate.crowdLevel}</span>
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {climate.country.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 border border-black/[0.06] rounded-2xl p-12 text-center shadow-sm">
            <p className="text-slate-600 font-medium">
              No destinations match your filters. Try adjusting the region or crowd level.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
