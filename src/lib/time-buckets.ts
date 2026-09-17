import type { OutingEvent, TimeBucket } from "@/lib/types";
import { addDays, nowJst, startOfDay } from "@/lib/jst";

export const BUCKET_LABELS: Record<TimeBucket, string> = {
  now: "今すぐ", today: "今日", tomorrow: "明日", this_week: "今週", later: "その先",
};

export function isEnded(event: Pick<OutingEvent, "endAt">, now = new Date()): boolean {
  return new Date(event.endAt).getTime() < now.getTime();
}
export function upcomingEvents<T extends Pick<OutingEvent, "endAt">>(events: T[], now = new Date()): T[] {
  return events.filter((e) => !isEnded(e, now));
}
export function classifyBucket(event: Pick<OutingEvent, "startAt" | "endAt">, now = new Date()): TimeBucket | "ended" {
  if (isEnded(event, now)) return "ended";
  const today0 = startOfDay(nowJst(now));
  const tomorrow0 = addDays(today0, 1);
  const dayAfter0 = addDays(today0, 2);
  const start = new Date(event.startAt);
  const end = new Date(event.endAt);
  const overlaps = (from: Date, to: Date) => start.getTime() < to.getTime() && end.getTime() > from.getTime();
  if (overlaps(today0, dayAfter0)) return "now";
  if (overlaps(today0, tomorrow0)) return "today";
  if (overlaps(tomorrow0, dayAfter0)) return "tomorrow";
  if (overlaps(today0, addDays(today0, 7))) return "this_week";
  return "later";
}
export function eventsInBucket(events: OutingEvent[], bucket: TimeBucket, now = new Date()): OutingEvent[] {
  return upcomingEvents(events, now)
    .filter((e) => classifyBucket(e, now) === bucket)
    .sort((a, b) => b.score - a.score || +new Date(a.startAt) - +new Date(b.startAt));
}
