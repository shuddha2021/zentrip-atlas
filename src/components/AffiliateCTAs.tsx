"use client";

import { buildFlightUrl, buildStayUrl } from "@/lib/affiliate";
import { useAnalytics } from "@/lib/useAnalytics";

interface AffiliateCTAsProps {
  countryCode: string;
  countryName: string;
  month: number;
  monthName: string;
}

/**
 * Subtle affiliate-ready CTAs for flights and stays.
 * Uses contextual text and optional affiliate tracking.
 */
export function AffiliateCTAs({ countryCode, countryName, month, monthName }: AffiliateCTAsProps) {
  const { trackOutboundClick } = useAnalytics();
  
  const flightUrl = buildFlightUrl({ countryCode, countryName, month });
  const staysUrl = buildStayUrl({ countryCode, countryName, month });

  const handleFlightClick = () => {
    trackOutboundClick(flightUrl, "flight");
  };

  const handleStayClick = () => {
    trackOutboundClick(staysUrl, "stay");
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Plan Your Trip
      </h2>
      <p className="text-sm text-slate-500 mb-5">
        Ready to visit {countryName} in {monthName}?
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={flightUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleFlightClick}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-600 font-medium text-sm hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
          </svg>
          Flights to {countryName} in {monthName}
          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        
        <a
          href={staysUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleStayClick}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-600 font-medium text-sm hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Stays in {countryName} for {monthName}
          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
      
      <p className="text-xs text-slate-400 mt-4 text-center">
        External links open in a new tab
      </p>
    </div>
  );
}
