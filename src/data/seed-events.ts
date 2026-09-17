import type { OutingEvent, UserContext } from "@/lib/types";
import { haversineKm } from "@/lib/region";

export function buildSeedEvents(now: Date, ctx: UserContext): OutingEvent[] {
  const base = now.toISOString();
  const samples: OutingEvent[] = [
    {
      id: "seed-ramen-1",
      title: "近くのラーメン店（サンプル）",
      description: "車なしで1分。雨でも行ける。",
      category: "ramen",
      startAt: base,
      endAt: new Date(now.getTime() + 3 * 3600 * 1000).toISOString(),
      venueName: "サンプル店",
      city: "サンプル市",
      prefecture: "サンプル県",
      latitude: ctx.lat + 0.01,
      longitude: ctx.lng + 0.01,
      distanceFromUserKm: 0,
      walkMinutes: 8,
      score: 0,
      confidence: "unverified",
      aiComment: "今から行ける。",
      goNowReason: "近くて安い。",
      recommendReason: "雨でもOK。",
      isSample: true,
      weatherDependent: false,
      limitedPeriod: false,
      adultOriented: false,
      foodAppeal: 70,
      rarity: 20,
      snsBuzz: 30,
      sources: [],
      createdAt: base,
      updatedAt: base,
    },
  ];
  return samples.map((e) => ({
    ...e,
    distanceFromUserKm: Math.round(haversineKm(ctx.lat, ctx.lng, e.latitude, e.longitude) * 10) / 10,
  }));
}
