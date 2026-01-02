interface CostOverviewProps {
  budgetTier: string;
  countryName: string;
}

/**
 * Cost overview section with estimated daily budget ranges.
 * Uses budgetTier from climate data to estimate costs.
 */
export function CostOverview({ budgetTier, countryName }: CostOverviewProps) {
  // Estimated daily budget ranges based on tier
  const budgetData: Record<string, { range: string; description: string; breakdown: { item: string; range: string }[] }> = {
    "$": {
      range: "$30–60",
      description: "Budget-friendly destination with affordable local options.",
      breakdown: [
        { item: "Accommodation", range: "$10–25" },
        { item: "Food", range: "$10–20" },
        { item: "Transport", range: "$5–10" },
        { item: "Activities", range: "$5–15" },
      ],
    },
    "$$": {
      range: "$60–120",
      description: "Moderate costs with good value for money.",
      breakdown: [
        { item: "Accommodation", range: "$25–50" },
        { item: "Food", range: "$20–35" },
        { item: "Transport", range: "$10–20" },
        { item: "Activities", range: "$10–25" },
      ],
    },
    "$$$": {
      range: "$120–200",
      description: "Higher costs typical of developed tourism destinations.",
      breakdown: [
        { item: "Accommodation", range: "$50–90" },
        { item: "Food", range: "$35–55" },
        { item: "Transport", range: "$20–35" },
        { item: "Activities", range: "$20–40" },
      ],
    },
  };

  const data = budgetData[budgetTier] || budgetData["$$"];

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Cost Overview
        </h2>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
          Estimated
        </span>
      </div>
      
      <p className="text-sm text-slate-500 mb-5">
        Approximate daily budget for {countryName}
      </p>

      {/* Main budget display */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/50 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg">
          {budgetTier}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">{data.range}</p>
          <p className="text-xs text-slate-500">per day, per person</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-5">{data.description}</p>

      {/* Breakdown */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">
          Typical Breakdown
        </p>
        {data.breakdown.map((item) => (
          <div key={item.item} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-600">{item.item}</span>
            <span className="text-sm font-medium text-slate-800">{item.range}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
        Costs vary by season, travel style, and booking timing. These are mid-range estimates.
      </p>
    </div>
  );
}
