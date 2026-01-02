"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "savedTrips";

export interface SavedTrip {
  id: string;       // Country code (e.g., "ES")
  code: string;     // ISO code
  name: string;     // Country name
  region?: string;  // Region (optional)
}

// Storage helper with SSR safety
function getStoredTrips(): SavedTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredTrips(trips: SavedTrip[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  } catch {
    // localStorage disabled or full - fail gracefully
  }
}

// External store for cross-component sync
let listeners: Array<() => void> = [];
let cachedTrips: SavedTrip[] = [];

function subscribe(callback: () => void): () => void {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot(): SavedTrip[] {
  if (typeof window === "undefined") return [];
  const trips = getStoredTrips();
  // Only update cache if changed to avoid unnecessary re-renders
  if (JSON.stringify(trips) !== JSON.stringify(cachedTrips)) {
    cachedTrips = trips;
  }
  return cachedTrips;
}

function getServerSnapshot(): SavedTrip[] {
  return [];
}

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

// Listen for storage events (cross-tab sync)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      emitChange();
    }
  });
}

/**
 * Hook to manage saved trips (wishlist) with localStorage persistence.
 * SSR-safe and syncs across tabs.
 */
export function useSavedTrips() {
  const trips = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isSaved = useCallback(
    (id: string): boolean => {
      return trips.some((trip) => trip.id === id);
    },
    [trips]
  );

  const save = useCallback((item: SavedTrip): void => {
    const current = getStoredTrips();
    // Prevent duplicates
    if (current.some((t) => t.id === item.id)) return;
    const updated = [...current, item];
    setStoredTrips(updated);
    emitChange();
  }, []);

  const remove = useCallback((id: string): void => {
    const current = getStoredTrips();
    const updated = current.filter((t) => t.id !== id);
    setStoredTrips(updated);
    emitChange();
  }, []);

  const toggle = useCallback(
    (item: SavedTrip): void => {
      if (isSaved(item.id)) {
        remove(item.id);
      } else {
        save(item);
      }
    },
    [isSaved, save, remove]
  );

  const getSavedTrips = useCallback((): SavedTrip[] => {
    return trips;
  }, [trips]);

  return {
    trips,
    getSavedTrips,
    isSaved,
    save,
    remove,
    toggle,
  };
}
