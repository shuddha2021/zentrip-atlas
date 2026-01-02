"use client";

import Link from "next/link";
import { useSavedTrips } from "@/lib/useSavedTrips";
import { SaveButton } from "@/components/SaveButton";

export default function SavedPage() {
  const { trips, remove } = useSavedTrips();

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Link 
            href="/" 
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors font-medium"
          >
            ← Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Saved Trips
          </h1>
          <p className="text-slate-500">
            {trips.length === 0
              ? "Your travel wishlist is empty"
              : `${trips.length} destination${trips.length === 1 ? "" : "s"} saved`
            }
          </p>
        </div>

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              No saved trips yet
            </h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Explore destinations and save the ones you love to build your travel wishlist.
            </p>
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Destinations
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}

        {/* Saved trips grid */}
        {trips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="group bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-black/[0.10] transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <Link href={`/country/${trip.code}`} className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {trip.name}
                    </h3>
                    {trip.region && (
                      <p className="text-sm text-slate-500 font-medium">
                        {trip.region}
                      </p>
                    )}
                  </Link>
                  <SaveButton
                    country={{ code: trip.code, name: trip.name, region: trip.region }}
                    compact
                  />
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <Link
                    href={`/country/${trip.code}`}
                    className="flex-1 text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => remove(trip.id)}
                    className="flex-1 text-center text-sm font-medium text-slate-500 hover:text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {trips.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/explorer"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              Explore more destinations →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
