"use client";

import { useState } from "react";

interface ClimateData {
  month: number;
  score: number;
  tempMinF: number;
  tempMaxF: number;
  rainMm: number;
  crowdLevel: string;
  budgetTier: string;
}

interface CompareMonthsProps {
  countryCode: string;
  countryName: string;
  currentMonth: number;
  currentClimate: ClimateData | null;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function fToC(f: number): number {
  return Math.round((f - 32) * (5 / 9));
}

function formatTempRangeC(minF: number, maxF: number): string {
  return `${fToC(minF)}–${fToC(maxF)}°C`;
}

export function CompareMonths({ 
  countryCode, 
  countryName, 
  currentMonth, 
  currentClimate 
}: CompareMonthsProps) {
  const [isComparing, setIsComparing] = useState(false);
  const [compareMonth, setCompareMonth] = useState(() => {
    // Default to a different month
    return currentMonth === 1 ? 7 : 1;
  });
  const [compareClimate, setCompareClimate] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch climate data for a given month
  const fetchClimate = async (monthToFetch: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/climate/${countryCode}/${monthToFetch}`);
      if (!res.ok) throw new Error("No data");
      const data = await res.json();
      setCompareClimate(data);
    } catch {
      setCompareClimate(null);
      setError(`No climate data available for ${MONTHS[monthToFetch - 1]}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle comparison mode
  const handleToggleCompare = () => {
    if (isComparing) {
      setCompareClimate(null);
      setError(null);
      setIsComparing(false);
    } else {
      setIsComparing(true);
      // Fetch data for the default compare month
      fetchClimate(compareMonth);
    }
  };

  // Handle month change
  const handleMonthChange = (newMonth: number) => {
    setCompareMonth(newMonth);
    fetchClimate(newMonth);
  };

  if (!currentClimate) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-bold text-slate-800">
          Compare Months
        </h2>
        <button
          onClick={handleToggleCompare}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
            isComparing 
              ? "bg-slate-800 text-white hover:bg-slate-700" 
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
          }`}
        >
          {isComparing ? "Close comparison" : "Compare months"}
        </button>
      </div>

      {isComparing && (
        <div className="space-y-5">
          {/* Month selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Compare with:</span>
            <select
              value={compareMonth}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
              className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1} disabled={i + 1 === currentMonth}>
                  {m} {i + 1 === currentMonth ? "(current)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-slate-400">Loading climate data...</div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-amber-700 text-sm">{error}</p>
              <p className="text-amber-600 text-xs mt-1">Try selecting a different month.</p>
            </div>
          )}

          {/* Comparison grid */}
          {compareClimate && !loading && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Current month */}
              <ComparisonCard
                monthName={MONTHS[currentMonth - 1]}
                climate={currentClimate}
                isCurrent
              />

              {/* Comparison month */}
              <ComparisonCard
                monthName={MONTHS[compareMonth - 1]}
                climate={compareClimate}
              />
            </div>
          )}

          {/* Quick insight */}
          {compareClimate && !loading && (
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Quick insight:</span>{" "}
                {generateInsight(currentClimate, compareClimate, MONTHS[currentMonth - 1], MONTHS[compareMonth - 1])}
              </p>
            </div>
          )}
        </div>
      )}

      {!isComparing && (
        <p className="text-sm text-slate-500">
          Not sure when to visit {countryName}? Compare different months side-by-side.
        </p>
      )}
    </div>
  );
}

function ComparisonCard({ 
  monthName, 
  climate, 
  isCurrent = false 
}: { 
  monthName: string; 
  climate: ClimateData; 
  isCurrent?: boolean;
}) {
  return (
    <div className={`rounded-xl p-5 border ${
      isCurrent 
        ? "bg-indigo-50/50 border-indigo-200" 
        : "bg-teal-50/50 border-teal-200"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold ${isCurrent ? "text-indigo-700" : "text-teal-700"}`}>
          {monthName}
        </h3>
        {isCurrent && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
            Current
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Score</span>
          <span className={`text-lg font-bold ${getScoreColor(climate.score)}`}>
            {climate.score}
          </span>
        </div>

        {/* Temperature */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Temperature</span>
          <span className="text-sm font-semibold text-rose-700">
            {formatTempRangeC(climate.tempMinF, climate.tempMaxF)}
          </span>
        </div>

        {/* Rainfall */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Rainfall</span>
          <span className="text-sm font-semibold text-blue-700">
            {climate.rainMm}mm
          </span>
        </div>

        {/* Crowds */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Crowds</span>
          <span className="text-sm font-semibold text-slate-700 capitalize">
            {climate.crowdLevel}
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Budget</span>
          <span className="text-sm font-semibold text-emerald-700">
            {climate.budgetTier}
          </span>
        </div>
      </div>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-amber-600";
  return "text-slate-600";
}

function generateInsight(
  current: ClimateData, 
  compare: ClimateData, 
  currentName: string, 
  compareName: string
): string {
  const scoreDiff = compare.score - current.score;
  const tempDiff = fToC(compare.tempMaxF) - fToC(current.tempMaxF);
  const rainDiff = compare.rainMm - current.rainMm;

  if (Math.abs(scoreDiff) < 5) {
    return `Both ${currentName} and ${compareName} offer similar travel experiences with comparable scores.`;
  }

  const better = scoreDiff > 0 ? compareName : currentName;
  const reasons: string[] = [];

  if (Math.abs(tempDiff) > 5) {
    reasons.push(tempDiff > 0 ? "warmer weather" : "cooler temperatures");
  }
  if (Math.abs(rainDiff) > 30) {
    reasons.push(rainDiff < 0 ? "less rainfall" : "more rainfall");
  }

  if (reasons.length > 0) {
    return `${better} scores higher, offering ${reasons.join(" and ")}.`;
  }

  return `${better} has a better overall travel score for this destination.`;
}
