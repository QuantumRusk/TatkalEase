export type PreauthorizedPassenger = { name: string; age: string; berth: string };

export type PreauthorizedBooking = {
  from: string;
  to: string;
  travelDate: string;
  travelClass: string;
  passengers: PreauthorizedPassenger[];
  orderId: string;
  pnr: string;
  opensAt: number;
};

const storageKey = "tatkalease-preauthorized-booking";

export function getPreauthorizedBooking(): PreauthorizedBooking | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as PreauthorizedBooking | null;
  } catch {
    return null;
  }
}

export function savePreauthorizedBooking(booking: PreauthorizedBooking) {
  window.localStorage.setItem(storageKey, JSON.stringify(booking));
}

export function markBookingOpen() {
  const booking = getPreauthorizedBooking();
  if (booking) savePreauthorizedBooking({ ...booking, opensAt: Date.now() });
}

export function clearPreauthorizedBooking() {
  window.localStorage.removeItem(storageKey);
}
