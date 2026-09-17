import { CATEGORY_META, DEFAULT_SCORE_WEIGHTS } from "@/data/score-weights";
import type { CategoryId, OutingEvent, ScoreWeights, UserFeedback, UserContext } from "@/lib/types";

export function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function preferenceBoostFromFeedback(
  event: Pick<OutingEvent, "id" | "category">,
  feedback: UserFeedback[],
): number {
  const catActions = feedback.filter((f) => f.eventId === event.id);
  let adj = 0;
  for (const f of feedback) {
    if (f.action === "went") adj += 1;
    if (f.action === "meh") adj -= 2;
  }
  const local =
    catActions.filter((f) => f.action === "went").length * 8 -
    catActions.filter((f) => f.action === "meh").length * 20;
  const catWeight = (CATEGORY_META[event.category].weight - 1) * 80;
  return clamp(55 + catWeight + local + Math.max(-10, Math.min(10, adj * 0.2)));
}

export function computeScore(
  input: {
    category: CategoryId; city: string; prefecture: string;
    distanceFromUserKm: number; walkMinutes: number;
    limitedPeriod: boolean; foodAppeal: number; adultOriented: boolean;
    snsBuzz: number; rarity: number;
  },
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS,
  feedback: UserFeedback[] = [],
  eventId = "",
): number {
  const pref = preferenceBoostFromFeedback({ id: eventId, category: input.category }, feedback);
  const limited = input.limitedPeriod ? 100 : 28;
  const totalWeight = weights.preferenceMatch + weights.limitedPeriod + weights.foodAppeal +
    weights.adultOriented + weights.distance + weights.snsBuzz + weights.rarity + weights.walkEase;
  const raw = (pref * weights.preferenceMatch + limited * weights.limitedPeriod +
    clamp(input.foodAppeal) * weights.foodAppeal + (input.adultOriented ? 92 : 35) * weights.adultOriented +
    clamp(100 - input.distanceFromUserKm * 2.0) * weights.distance +
    clamp(input.snsBuzz) * weights.snsBuzz + clamp(input.rarity) * weights.rarity +
    clamp(100 - input.walkMinutes * 1.2) * weights.walkEase) / totalWeight;
  return clamp(raw);
}

export function passesBudget(event: Pick<OutingEvent, "priceText">, budgetYen: number): boolean {
  if (!event.priceText) return true;
  const m = event.priceText.match(/(\d[\d,]*)/);
  if (!m) return true;
  const yen = parseInt(m[1].replace(/,/g, ""), 10);
  return yen <= budgetYen;
}

export function passesRain(event: Pick<OutingEvent, "weatherDependent">, rainOk: boolean): boolean {
  return rainOk || !event.weatherDependent;
}

export function filterByContext(events: OutingEvent[], ctx: UserContext): OutingEvent[] {
  return events.filter((e) =>
    passesBudget(e, ctx.budgetYen) &&
    passesRain(e, ctx.rainOk) &&
    e.walkMinutes <= ctx.maxWalkMinutes
  );
}
