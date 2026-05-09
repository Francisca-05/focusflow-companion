import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileFrame } from "@/components/focusflow/MobileFrame";
import { BottomNav } from "@/components/focusflow/BottomNav";
import { Flame } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "FocusFlow — Home" }, { name: "description", content: "Stay focused with FocusFlow." }] }),
  component: Splash,
});

function Splash() {
  const { user } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: user ? "/home" : "/login" }), 1400);
    return () => clearTimeout(t);
  }, [user, navigate]);
  return (
    <MobileFrame variant="purple">
      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <div className="h-24 w-24 rounded-3xl bg-white/15 backdrop-blur flex items-center justify-center shadow-2xl mb-6 animate-pulse">
          <Flame className="h-12 w-12 text-white" strokeWidth={2.2} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">FocusFlow</h1>
        <p className="text-sm text-white/75 mt-2">Find your focus.</p>
      </div>
    </MobileFrame>
  );
}

export function HomeScreen() {
  const { user, tasks, todayMinutes, streak } = useStore();
  const mins = todayMinutes();
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const completed = tasks.filter((t) => t.done).length;
  const todayTask = tasks.find((t) => !t.done);
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    const hr = new Date().getHours();
    setGreeting(hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening");
  }, []);
  const dots = Math.min(streak, 5);
  return (
    <MobileFrame>
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <header className="pt-8 pb-6">
          <h1 className="text-2xl font-bold tracking-tight">{greeting}, {user?.name ?? "there"}</h1>
          <p className="text-sm text-muted-foreground mt-1">Ready to Focus?</p>
        </header>

        <div className="hover-glow bg-card rounded-3xl p-5 shadow-card border border-border/60 mb-6 transition-all duration-300">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today's Focus</p>
          <h2 className="text-xl font-bold mt-2">{todayTask?.title ?? "No task scheduled"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{todayTask ? `${todayTask.duration} min` : "Add a task to begin"}</p>
          <Link
            to="/focus"
            className="hover-glow mt-4 block w-full text-center bg-gradient-button text-primary-foreground font-semibold py-3.5 rounded-2xl shadow-button active:scale-[0.98] transition-transform"
          >
            Start Focus
          </Link>
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-3">Your Progress</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="hover-glow bg-card rounded-2xl p-4 shadow-soft border border-border/60 transition-all duration-300">
            <p className="text-xs text-muted-foreground">Focus Time</p>
            <p className="text-xl font-bold mt-2">{h}h {m}m</p>
          </div>
          <div className="hover-glow bg-card rounded-2xl p-4 shadow-soft border border-border/60 transition-all duration-300">
            <p className="text-xs text-muted-foreground">Tasks Completed</p>
            <p className="text-xl font-bold mt-2">{completed}</p>
          </div>
        </div>

        <div className="hover-glow bg-card rounded-2xl p-4 shadow-soft border border-border/60 flex items-center justify-between transition-all duration-300">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Flame className="h-3 w-3 text-primary" /> Focus Streak</p>
            <p className="text-xl font-bold mt-1">{streak} <span className="text-sm font-normal text-muted-foreground">days</span></p>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className={`h-2.5 w-2.5 rounded-full ${i < dots ? "bg-primary" : "bg-lavender"}`} />
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}
