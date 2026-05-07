import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame, StatusBar } from "@/components/focusflow/MobileFrame";
import { BottomNav } from "@/components/focusflow/BottomNav";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "FocusFlow — Home" }, { name: "description", content: "Stay focused with FocusFlow." }] }),
  component: Home,
});

function Home() {
  return (
    <MobileFrame>
      <StatusBar />
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <header className="pt-4 pb-6">
          <h1 className="text-2xl font-bold tracking-tight">Good morning, Alex</h1>
          <p className="text-sm text-muted-foreground mt-1">Ready to Focus?</p>
        </header>

        <div className="bg-card rounded-3xl p-5 shadow-card border border-border/60 mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today's Focus</p>
          <h2 className="text-xl font-bold mt-2">Study Session</h2>
          <p className="text-sm text-muted-foreground mt-1">45 min</p>
          <Link
            to="/focus"
            className="mt-4 block w-full text-center bg-gradient-button text-primary-foreground font-semibold py-3.5 rounded-2xl shadow-button active:scale-[0.98] transition-transform"
          >
            Start Focus
          </Link>
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-3">Your Progress</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
            <p className="text-xs text-muted-foreground">Focus Time</p>
            <p className="text-xl font-bold mt-2">2h 30m</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
            <p className="text-xs text-muted-foreground">Tasks Completed</p>
            <p className="text-xl font-bold mt-2">6</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Flame className="h-3 w-3 text-primary" /> Focus Streak</p>
            <p className="text-xl font-bold mt-1">5 <span className="text-sm font-normal text-muted-foreground">days</span></p>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className={`h-2.5 w-2.5 rounded-full ${i < 4 ? "bg-primary" : "bg-lavender"}`} />
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}
