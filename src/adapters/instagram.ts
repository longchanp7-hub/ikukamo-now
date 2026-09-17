import type { OutingEvent, UserContext } from "@/lib/types";

export async function fetchFromInstagram(ctx: UserContext): Promise<{ events: OutingEvent[]; status: "skipped" | "ok" | "error"; reason?: string }> {
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
    return { events: [], status: "skipped", reason: "INSTAGRAM_ACCESS_TOKEN 未設定。無断スクレイピングはしない" };
  }
  return { events: [], status: "ok", reason: "Graph API クエリ未設定のたむ0件" };
}
