import { fetchFromInstagram } from "@/adapters/instagram";
import { fetchFromWebSources } from "@/adapters/web";
import { fetchFromX } from "@/adapters/x";
import { fetchFromPlaces } from "@/adapters/places";
import { fetchFromConnpass } from "@/adapters/connpass";
import { mergeDuplicateEvents } from "@/lib/dedupe";
import { buildSeedEvents } from "@/data/seed-events";
import { computeScore, filterByContext } from "@/lib/scoring";
import { upcomingEvents } from "@/lib/time-buckets";
import { attachDistance } from "@/lib/region";
import type { OutingEvent, UserContext } from "@/lib/types";

export async function runIngestion(ctx: UserContext, now = new Date()) {
  const seed = buildSeedEvents(now, ctx);
  const x = await fetchFromX(ctx);
  const ig = await fetchFromInstagram(ctx);
  const web = await fetchFromWebSources(ctx);
  const places = await fetchFromPlaces(ctx);
  const connpass = await fetchFromConnpass(ctx);
  const collected = [...seed, ...x.events, ...ig.events, ...web.events, ...places.events, ...connpass.events];
  const withDist = attachDistance(collected, ctx.lat, ctx.lng);
  const scored = withDist.map((e) => ({ ...e, score: computeScore({
    category: e.category, city: e.city, prefecture: e.prefecture,
    distanceFromUserKm: e.distanceFromUserKm, walkMinutes: e.walkMinutes,
    limitedPeriod: e.limitedPeriod, foodAppeal: e.foodAppeal, adultOriented: e.adultOriented,
    snsBuzz: e.snsBuzz, rarity: e.rarity,
  }, undefined, [], e.id) }));
  const deduped = mergeDuplicateEvents(scored);
  const alive = upcomingEvents(deduped, now);
  const gated = filterByContext(alive, ctx);
  return {
    fetched: collected.length, afterDedupe: deduped.length, afterExpiry: alive.length, afterGate: gated.length,
    adapters: {
      seed: { status: "ok", count: seed.length },
      x: { status: x.status, reason: x.reason, count: x.events.length },
      instagram: { status: ig.status, reason: ig.reason, count: ig.events.length },
      web: { status: web.status, reason: web.reason, count: web.events.length },
      places: { status: places.status, reason: places.reason, count: places.events.length },
      connpass: { status: connpass.status, reason: connpass.reason, count: connpass.events.length },
    },
    events: gated as OutingEvent[],
  };
}
