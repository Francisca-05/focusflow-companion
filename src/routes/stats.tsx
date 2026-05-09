import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/focusflow/MobileFrame";
import { BottomNav } from "@/components/focusflow/BottomNav";
import { useStore } from "@/lib/store";
import { useAuthGuard } from "@/lib/guard";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "FocusFlow — Stats" }] }),
  component: Stats,
});

type Tab = "Day" | "Week" | "Month";
const labels = ["M", "T", "W", "T", "F", "S", "S"];

function Stats() {
  useAuthGuard();
  const { weeklyMinutes, tasks, sessions } = useStore();
  const [tab, setTab] = useState<Tab>("Day");
  const data = weeklyMinutes();
  const max = Math.max(...data, 1);
  const totalMin = data.reduce((a, b) => a + b, 0);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const completed = tasks.filter((t) => t.done).length;
  const topHour = (() => {
    if (sessions.length === 0) return "—";
    const counts = new Array(24).fill(0);
    sessions.forEach((s) => { counts[new Date(s.date).getHours()] += s.minutes; });
    const i = counts.indexOf(Math.max(...counts));
    return `${i}:00 - ${i + 1}:00`;
  })();
  return (
    <MobileFrame>
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h1 className="text-2xl font-bold tracking-tight pt-8 pb-5">Stats</h1>
        <div className="flex gap-2 bg-secondary rounded-2xl p-1.5 mb-6">
          {(["Day", "Week", "Month"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-sm font-semibold py-2 rounded-xl transition-all ${
                tab === t ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-5 shadow-card border border-border/60 mb-4 relative">
          {totalMin === 0 && (
            <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-xs text-muted-foreground pointer-events-none">
              No focus sessions yet — start one to see your week
            </p>
          )}
          <div className="h-44 flex items-end justify-between gap-2">
            {data.map((v, i) => {
              const pct = totalMin === 0 ? 0 : (v / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <div className="relative w-full flex-1 rounded-lg bg-lavender/40 overflow-hidden flex items-end">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-primary to-primary-soft transition-all duration-700 ease-out"
                      style={{ height: `${Math.max(pct, v > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold">{labels[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
            <p className="text-xs text-muted-foreground">Focus Time</p>
            <p className="text-xl font-bold mt-2">{h}h {m}m</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
            <p className="text-xs text-muted-foreground">Tasks Completed</p>
            <p className="text-xl font-bold mt-2">{completed}</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
          <p className="text-xs text-muted-foreground">Top Focus Time</p>
          <p className="text-lg font-bold mt-2">{topHour}</p>
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}