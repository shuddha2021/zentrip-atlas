"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const REGIONS = ["All", "Europe", "Asia", "Americas", "Africa", "Oceania", "Middle East"] as const;
const CROWDS = ["All", "low", "medium", "high"] as const;

type Region = typeof REGIONS[number];
type Crowd = typeof CROWDS[number];

interface ExplorerFiltersProps {
  currentMonth: number;
  totalResults: number;
}

export function ExplorerFilters({ currentMonth, totalResults }: ExplorerFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [region, setRegion] = useState<Region>("All");
  const [crowd, setCrowd] = useState<Crowd>("All");

  const handleMonthChange = useCallback((newMonth: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(newMonth));
    router.push(`/explorer?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
            Explore destinations
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--text-muted)]">
            {totalResults} destinations
          </span>
          
          {/* Month picker */}
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg p-1">
            {MONTHS.map((name, idx) => (
              <button
                key={idx}
                onClick={() => handleMonthChange(idx + 1)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  currentMonth === idx + 1
                    ? "bg-white text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Filters</span>
        
        {/* Region filter */}
        <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-1">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                region === r
                  ? "bg-white text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Crowd filter */}
        <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-1">
          {CROWDS.map((c) => (
            <button
              key={c}
              onClick={() => setCrowd(c)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all capitalize ${
                crowd === c
                  ? "bg-white text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {c === "All" ? "All crowds" : c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function useFilters() {
  const [region, setRegion] = useState<Region>("All");
  const [crowd, setCrowd] = useState<Crowd>("All");
  
  return { region, setRegion, crowd, setCrowd };
}

export { REGIONS, CROWDS };
export type { Region, Crowd };
