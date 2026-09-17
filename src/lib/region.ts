import type { OutingEvent } from "@/lib/types";

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function mapsUrl(lat: number, lng: number, name: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + lat + "," + lng)}`;
}

export function attachDistance(events: OutingEvent[], userLat: number, userLng: number): OutingEvent[] {
  return events.map((e) => ({
    ...e,
    distanceFromUserKm: Math.round(haversineKm(userLat, userLng, e.latitude, e.longitude) * 10) / 10,
  }));
}
