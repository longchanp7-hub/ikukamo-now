import type { OutingEvent, UserContext } from "@/lib/types";

export async function fetchFromConnpass(ctx: UserContext): Promise<{ events: OutingEvent[]; status: "skipped" | "ok" | "error"; reason?: string }> {
  // Connpass 公開APIは無料。keyword + yyyymmdd で検索
  try {
    const url = `https://connpass.com/api/v1/event/?keyword=event&count=20&order=2`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { events: [], status: "error", reason: `HTTP ${res.status}` };
    const data = await res.json();
    const events: OutingEvent[] = (data.events || []).map((e: any) => ({
      id: `connpass-${e.event_id}`,
      title: e.title,
      description: e.description || "",
      category: "other" as const,
      startAt: e.started_at,
      endAt: e.ended_at,
      venueName: e.place || "",
      city: e.address || "",
      prefecture: "",
      latitude: 0,
      longitude: 0,
      distanceFromUserKm: 0,
      walkMinutes: 999,
      score: 0,
      confidence: "high" as const,
      officialUrl: e.event_url,
      aiComment: "",
      goNowReason: "",
      recommendReason: "",
      isSample: false,
      weatherDependent: false,
      limitedPeriod: true,
      adultOriented: false,
      foodAppeal: 0,
      rarity: 0,
      snsBuzz: 0,
      sources: [{ id: `s-connpass-${e.event_id}`, eventId: `connpass-${e.event_id}`, sourceType: "web", sourceName: "Connpass", sourceUrl: e.event_url, fetchedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    return { events, status: "ok" };
  } catch (err: any) {
    return { events: [], status: "error", reason: err?.message || "fetch failed" };
  }
}
