"use client";

import { useSavedTrips, SavedTrip } from "@/lib/useSavedTrips";

interface SaveButtonProps {
  country: {
    code: string;
    name: string;
    region?: string;
  };
  /** Compact mode for cards (smaller, icon-only on mobile) */
  compact?: boolean;
  className?: string;
}

/**
 * Save/unsave button for adding countries to wishlist.
 * Uses localStorage for persistence.
 */
export function SaveButton({ country, compact = false, className = "" }: SaveButtonProps) {
  const { isSaved, toggle } = useSavedTrips();
  
  const saved = isSaved(country.code);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    e.stopPropagation();
    
    const item: SavedTrip = {
      id: country.code,
      code: country.code,
      name: country.name,
      region: country.region,
    };
    toggle(item);
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className={`
          p-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30
          ${saved
            ? "bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-200"
            : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-200/50 hover:border-rose-200"
          }
          ${className}
        `}
        title={saved ? "Remove from saved" : "Save to wishlist"}
        aria-label={saved ? "Remove from saved" : "Save to wishlist"}
      >
        <svg
          className="w-4 h-4"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30
        ${saved
          ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
          : "bg-white/80 text-slate-600 border border-slate-200/50 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
        }
        ${className}
      `}
      aria-label={saved ? "Remove from saved" : "Save to wishlist"}
    >
      <svg
        className="w-4 h-4"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
