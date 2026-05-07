import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame, StatusBar } from "@/components/focusflow/MobileFrame";
import { BottomNav } from "@/components/focusflow/BottomNav";
import { Check, Plus } from "lucide-react";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "FocusFlow — Tasks" }] }),
  component: Tasks,
});

type Tab = "Today" | "Upcoming" | "Completed";
const initial = [
  { id: 1, title: "Math Assignment", duration: "1h", done: false },
  { id: 2, title: "Read Chapter 4", duration: "30m", done: false },
  { id: 3, title: "Project Research", duration: "1h", done: false },
  { id: 4, title: "Review Notes", duration: "45m", done: false },
];

function Tasks() {
  const [tab, setTab] = useState<Tab>("Today");
  const [tasks, setTasks] = useState(initial);
  const toggle = (id: number) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const visible = tab === "Completed" ? tasks.filter((t) => t.done) : tab === "Today" ? tasks : [];

  return (
    <MobileFrame>
      <StatusBar />
      <div className="flex-1 px-6 pb-6 overflow-y-auto relative">
        <h1 className="text-2xl font-bold tracking-tight pt-4 pb-5">Tasks</h1>
        <div className="flex gap-2 bg-secondary rounded-2xl p-1.5 mb-6">
          {(["Today", "Upcoming", "Completed"] as Tab[]).map((t) => (
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
        <div className="space-y-3">
          {visible.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-12">No tasks here</p>
          ) : (
            visible.map((t) => (
              <button
                key={t.id}
                onClick={() => toggle(t.id)}
                className="w-full bg-card rounded-2xl p-4 shadow-soft border border-border/60 flex items-center gap-3 active:scale-[0.99] transition-transform"
              >
                <span
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    t.done ? "bg-primary border-primary" : "border-border"
                  }`}
                >
                  {t.done && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
                </span>
                <span className={`flex-1 text-left text-sm font-medium ${t.done ? "line-through text-muted-foreground" : ""}`}>
                  {t.title}
                </span>
                <span className="text-xs text-muted-foreground font-medium">{t.duration}</span>
              </button>
            ))
          )}
        </div>
        <button className="absolute bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-button shadow-button text-primary-foreground flex items-center justify-center active:scale-95 transition-transform">
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}