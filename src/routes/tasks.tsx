import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/focusflow/MobileFrame";
import { BottomNav } from "@/components/focusflow/BottomNav";
import { Check, Plus, X, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuthGuard } from "@/lib/guard";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "FocusFlow — Tasks" }] }),
  component: Tasks,
});

type Tab = "Today" | "Upcoming" | "Completed";

function Tasks() {
  useAuthGuard();
  const { tasks, toggleTask, removeTask, addTask } = useStore();
  const [tab, setTab] = useState<Tab>("Today");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(45);

  const visible =
    tab === "Completed" ? tasks.filter((t) => t.done)
    : tab === "Today" ? tasks.filter((t) => !t.done)
    : tasks.filter((t) => !t.done);

  const submit = () => {
    if (!title.trim()) return;
    addTask(title.trim(), duration);
    setTitle(""); setDuration(45); setOpen(false);
  };

  return (
    <MobileFrame>
      <div className="flex-1 px-6 pb-32 overflow-y-auto relative">
        <h1 className="text-2xl font-bold tracking-tight pt-8 pb-5 animate-slide-up">Tasks</h1>
        <div className="flex gap-2 bg-secondary rounded-2xl p-1.5 mb-6">
          {(["Today", "Upcoming", "Completed"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-sm font-semibold py-2 rounded-xl transition-all duration-300 press ${
                tab === t ? "bg-card text-primary shadow-card scale-[1.02]" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="space-y-3 stagger" key={tab}>
          {visible.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-12 animate-fade-in">No tasks yet — tap + to add one.</p>
          ) : (
            visible.map((t) => (
              <div key={t.id} className="w-full bg-card rounded-2xl p-4 shadow-soft border border-border/60 flex items-center gap-3 hover:shadow-card transition-all duration-300">
                <button onClick={() => toggleTask(t.id)} className="flex items-center gap-3 flex-1 text-left active:scale-[0.99] transition-transform">
                  <span className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${t.done ? "bg-gradient-button border-primary scale-110" : "border-border"}`}>
                    {t.done && <Check className="h-3.5 w-3.5 text-primary-foreground animate-pop" strokeWidth={3} />}
                  </span>
                  <span className={`flex-1 text-sm font-medium ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.title}</span>
                  <span className="text-xs text-muted-foreground font-medium">{t.duration}m</span>
                </button>
                <button onClick={() => removeTask(t.id)} className="text-muted-foreground hover:text-destructive hover:scale-110 transition-all press">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <button
        onClick={() => setOpen(true)}
        aria-label="Add task"
        className="hover-glow fixed bottom-28 right-6 sm:right-[max(1.5rem,calc(50%-220px+1.5rem))] h-14 w-14 rounded-full bg-gradient-button shadow-button text-primary-foreground flex items-center justify-center active:scale-90 hover:scale-110 hover:rotate-90 transition-all duration-300 z-40 animate-glow"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="bg-card w-full sm:max-w-sm rounded-3xl p-6 space-y-4 animate-bounce-in shadow-2xl my-auto max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold animate-slide-up">New Task</h3>
              <button onClick={() => setOpen(false)} className="press h-9 w-9 rounded-full bg-muted flex items-center justify-center"><X className="h-5 w-5" /></button>
            </div>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name"
              className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div>
              <label className="text-xs text-muted-foreground">Duration: <span className="text-primary font-bold">{duration} min</span></label>
              <input type="range" min={5} max={120} step={5} value={duration} onChange={(e) => setDuration(+e.target.value)} className="w-full mt-2 accent-primary" />
            </div>
            <button onClick={submit} className="hover-glow w-full bg-gradient-button text-primary-foreground font-semibold py-3.5 rounded-2xl shadow-button active:scale-[0.98] transition-transform">
              Add Task
            </button>
          </div>
        </div>
      )}
      <BottomNav />
    </MobileFrame>
  );
}