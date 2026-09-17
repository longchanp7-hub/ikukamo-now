import type { OutingEvent, UserContext } from "@/lib/types";

export async function fetchFromPlaces(ctx: UserContext): Promise<{ events: OutingEvent[]; status: "skipped" | "ok" | "error"; reason?: string }> {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return { events: [], status: "skipped", reason: "GOOGLE_PLACES_API_KEY 未設定" };
  }
  // TODO: Nearby Search + details → OutingEvent[]
  return { events: [], status: "ok", reason: "Places adapter 未実装" };
}
