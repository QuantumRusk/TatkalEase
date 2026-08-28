export type BookingHistoryItem = {
  pnr: string;
  orderId: string;
  train: { number: string; name: string; time: string };
  from: string;
  to: string;
  travelDate: string;
  travelClass: string;
  passengers: Array<{ name: string; age: string; berth: string; seat: string }>;
  confirmedAt: number;
};

const storageKey = "tatkalease-booking-history";

export function getBookingHistory(): BookingHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as BookingHistoryItem[];
    return Array.isArray(stored) ? stored.sort((a, b) => b.confirmedAt - a.confirmedAt) : [];
  } catch {
    return [];
  }
}

export function saveBookingToHistory(booking: BookingHistoryItem) {
  const withoutDuplicate = getBookingHistory().filter((item) => item.pnr !== booking.pnr);
  window.localStorage.setItem(storageKey, JSON.stringify([booking, ...withoutDuplicate].sort((a, b) => b.confirmedAt - a.confirmedAt)));
}
