import type { OutingEvent, UserContext } from "@/lib/types";
export async function fetchFromWebSources(ctx: UserContext): Promise<{ events: OutingEvent[]; status: "skipped" | "ok" | "error"; reason?: string }> {
  if (process.env.DISABLE_WEB_FETCH === "1") return { events: [], status: "skipped", reason: "DISABLE_WEB_FETCH=1" };
  return { events: [], status: "ok", reason: "Webクローラ未接続" };
}
