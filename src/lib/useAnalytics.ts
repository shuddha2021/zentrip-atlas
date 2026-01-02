"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight analytics tracking hook.
 * Sends page views on route change and provides event tracking.
 */
export function useAnalytics() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track an event (non-blocking)
  const trackEvent = useCallback((
    event: string,
    properties?: Record<string, unknown>
  ) => {
    // Fire and forget - don't block UI
    try {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          path: typeof window !== "undefined" ? window.location.pathname : null,
          referrer: typeof document !== "undefined" ? document.referrer : null,
          properties,
        }),
        keepalive: true, // Ensure request completes even on navigation
      }).catch(() => {
        // Silently ignore errors
      });
    } catch {
      // Silently ignore
    }
  }, []);

  // Track outbound affiliate clicks
  const trackOutboundClick = useCallback((
    url: string,
    type: "flight" | "stay"
  ) => {
    trackEvent("outbound_click", { url, type });
  }, [trackEvent]);

  // Track share clicks
  const trackShareClick = useCallback(() => {
    trackEvent("share_click");
  }, [trackEvent]);

  // Track save trip
  const trackSaveTrip = useCallback((
    countryCode: string,
    month: number
  ) => {
    trackEvent("save_trip", { countryCode, month });
  }, [trackEvent]);

  // Track page views on route change (debounced)
  useEffect(() => {
    if (pathname === lastPathRef.current) return;
    
    // Debounce to avoid rapid-fire on redirects
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      lastPathRef.current = pathname;
      trackEvent("page_view");
    }, 100);
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [pathname, trackEvent]);

  return {
    trackEvent,
    trackOutboundClick,
    trackShareClick,
    trackSaveTrip,
  };
}
