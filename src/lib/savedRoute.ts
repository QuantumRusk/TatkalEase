export type SavedRoute = { from: string; to: string };

export const defaultSavedRoute: SavedRoute = {
  from: "Mumbai Central",
  to: "Ahmedabad",
};

export const routeStations = [
  "Mumbai Central", "Surat", "Vadodara", "Ahmedabad", "Pune",
  "Nagpur", "Bhopal", "New Delhi", "Jaipur", "Kota",
];

const storageKey = "tatkalease-saved-route";

export function getSavedRoute(): SavedRoute {
  if (typeof window === "undefined") return defaultSavedRoute;
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as Partial<SavedRoute> | null;
    if (stored?.from && stored?.to && stored.from !== stored.to) return { from: stored.from, to: stored.to };
  } catch {
    // A missing or malformed browser value simply falls back to the demo route.
  }
  return defaultSavedRoute;
}

export function saveSavedRoute(route: SavedRoute) {
  window.localStorage.setItem(storageKey, JSON.stringify(route));
}
