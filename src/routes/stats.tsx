import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/focusflow/MobileFrame";
import { BottomNav } from "@/components/focusflow/BottomNav";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "FocusFlow — Stats" }] }),
  component: Stats,
});

type Tab = "Day" | "Week" | "Month";
const data = [40, 70, 55, 90, 45, 75, 60];
const labels = ["M", "T", "W", "T", "F", "S", "S"];

function Stats() {
  const [tab, setTab] = useState<Tab>("Day");
  return (
    <MobileFrame>
      <StatusBar />
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h1 className="text-2xl font-bold tracking-tight pt-4 pb-5">Stats</h1>
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

        <div className="bg-card rounded-3xl p-5 shadow-card border border-border/60 mb-4">
          <div className="h-44 flex items-end justify-between gap-2">
            {data.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-soft transition-all"
                  style={{ height: `${v}%` }}
                />
                <span className="text-[10px] text-muted-foreground font-medium">{labels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
            <p className="text-xs text-muted-foreground">Focus Time</p>
            <p className="text-xl font-bold mt-2">2h 30m</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
            <p className="text-xs text-muted-foreground">Tasks Completed</p>
            <p className="text-xl font-bold mt-2">6</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
          <p className="text-xs text-muted-foreground">Top Focus Time</p>
          <p className="text-lg font-bold mt-2">10:00 AM - 12:00 PM</p>
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}