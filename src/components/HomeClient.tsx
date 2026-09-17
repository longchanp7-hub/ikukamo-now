"use client";
import { useMemo, useState } from "react";
import type { OutingEvent } from "@/lib/types";

type Mood = "bored" | "drink" | "lazy";
const MOODS: { id: Mood; label: string }[] = [
  { id: "bored", label: "暇" },
  { id: "drink", label: "飲みたい" },
  { id: "lazy", label: "動きたくない" },
];

export function HomeClient({
  events,
  adapters,
}: {
  events: OutingEvent[];
  adapters: Record<string, { status: string; reason?: string; count: number }>;
}) {
  const [mood, setMood] = useState<Mood>("bored");
  const list = useMemo(() => {
    return [...events].sort((a, b) => a.walkMinutes - b.walkMinutes || b.score - a.score);
  }, [events]);

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 safe-top" style={{ paddingBottom: 40 }}>
      <header className="mb-5 pt-4">
        <p className="text-[11px] tracking-[0.28em]" style={{ color: "var(--muted)" }}>NOW</p>
        <h1 style={{ fontSize: 34, margin: "4px 0 0" }}>今すぐ行ける</h1>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>車なし・予算3000円・1時間以内</p>
      </header>

      <div className="hide-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20 }}>
        {MOODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMood(m.id)}
            style={{
              borderRadius: 999,
              padding: "8px 14px",
              background: mood === m.id ? "var(--ink)" : "var(--chip)",
              color: mood === m.id ? "var(--bg)" : "var(--ink)",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p style={{ background: "var(--chip)", borderRadius: 28, padding: "40px 16px", textAlign: "center", color: "var(--muted)" }}>
          今は強い候補なし
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {list.map((e) => (
            <article key={e.id} style={{ background: "var(--chip)", borderRadius: 24, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>
                {e.city} · 徒歩{e.walkMinutes}分 · {e.distanceFromUserKm}km
              </p>
              <h2 style={{ margin: "6px 0 8px", fontSize: 18 }}>{e.title}</h2>
              <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>{e.goNowReason || e.recommendReason}</p>
              {e.officialUrl && (
                <a href={e.officialUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 10, color: "var(--accent)" }}>
                  開く
                </a>
              )}
            </article>
          ))}
        </div>
      )}

      <details style={{ marginTop: 24, color: "var(--muted)", fontSize: 12 }}>
        <summary>アダプタ状況</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(adapters, null, 2)}</pre>
      </details>
    </div>
  );
}
