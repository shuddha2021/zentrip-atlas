import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics | Admin | ZenTrip Atlas",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const params = await searchParams;
  const adminSecret = process.env.ADMIN_SECRET;
  
  // If no admin secret configured, return 404
  if (!adminSecret) {
    notFound();
  }
  
  // Check secret from query param
  if (params.secret !== adminSecret) {
    redirect(`/admin/analytics?error=unauthorized`);
  }
  
  // Fetch last 100 events
  let events: Array<{
    id: number;
    event: string;
    path: string | null;
    referrer: string | null;
    properties: unknown;
    ip: string | null;
    createdAt: Date;
  }> = [];
  
  let stats = {
    totalEvents: 0,
    pageViews: 0,
    outboundClicks: 0,
    saveTrips: 0,
    subscribers: 0,
  };
  
  try {
    events = await prisma.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    
    // Get basic stats
    const [totalEvents, pageViews, outboundClicks, saveTrips, subscribers] = await Promise.all([
      prisma.analyticsEvent.count(),
      prisma.analyticsEvent.count({ where: { event: "page_view" } }),
      prisma.analyticsEvent.count({ where: { event: "outbound_click" } }),
      prisma.analyticsEvent.count({ where: { event: "save_trip" } }),
      prisma.emailSubscriber.count({ where: { isActive: true } }),
    ]);
    
    stats = { totalEvents, pageViews, outboundClicks, saveTrips, subscribers };
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Analytics Dashboard
        </h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">{stats.totalEvents}</div>
            <div className="text-sm text-slate-500">Total Events</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-indigo-600">{stats.pageViews}</div>
            <div className="text-sm text-slate-500">Page Views</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-emerald-600">{stats.outboundClicks}</div>
            <div className="text-sm text-slate-500">Outbound Clicks</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-amber-600">{stats.saveTrips}</div>
            <div className="text-sm text-slate-500">Saved Trips</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-teal-600">{stats.subscribers}</div>
            <div className="text-sm text-slate-500">Subscribers</div>
          </div>
        </div>
        
        {/* Events Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-700">Recent Events (Last 100)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Time</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Event</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Path</th>
                  <th className="text-left py-2 px-4 font-medium text-slate-600">Properties</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(event.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        event.event === "page_view" ? "bg-indigo-100 text-indigo-700" :
                        event.event === "outbound_click" ? "bg-emerald-100 text-emerald-700" :
                        event.event === "save_trip" ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {event.event}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-slate-600 max-w-xs truncate">
                      {event.path || "-"}
                    </td>
                    <td className="py-2 px-4 text-slate-500 max-w-xs truncate font-mono text-xs">
                      {event.properties ? JSON.stringify(event.properties) : "-"}
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No events recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <p className="text-sm text-slate-400 mt-4 text-center">
          Privacy-respecting first-party analytics. No cookies, no third-party tracking.
        </p>
      </div>
    </div>
  );
}
