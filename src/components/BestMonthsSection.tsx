interface MonthRanking {
  month: number;
  monthName: string;
  score: number;
  reason: string;
}

interface BestMonthsSectionProps {
  best: MonthRanking[];
  avoid: MonthRanking[];
  countryName: string;
}

/**
 * Best Months to Visit section for country detail page.
 * Shows top 3 recommended months and months to potentially avoid.
 */
export function BestMonthsSection({ best, avoid, countryName }: BestMonthsSectionProps) {
  if (best.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-6 mb-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Best Months to Visit {countryName}
      </h2>

      {/* Best months */}
      <div className="space-y-3 mb-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600 mb-3">
          Recommended
        </p>
        {best.map((m, idx) => (
          <div
            key={m.month}
            className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/50"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm shrink-0">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-800">{m.monthName}</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Score: {m.score}
                </span>
              </div>
              <p className="text-sm text-slate-600">{m.reason}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Months to avoid */}
      {avoid.length > 0 && (
        <div className="space-y-3 pt-5 border-t border-slate-200/60">
          <p className="text-xs uppercase tracking-wider font-semibold text-amber-600 mb-3">
            Consider Avoiding
          </p>
          {avoid.map((m) => (
            <div
              key={m.month}
              className="flex items-start gap-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200/50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-800">{m.monthName}</span>
                  <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    Score: {m.score}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{m.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
