import { createFileRoute } from "@tanstack/react-router";
import { MobileFrame, StatusBar } from "@/components/focusflow/MobileFrame";
import { BottomNav } from "@/components/focusflow/BottomNav";
import { Settings, Bell, HelpCircle, LogOut, ChevronRight, Flame, User } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "FocusFlow — Profile" }] }),
  component: Profile,
});

const menu = [
  { icon: Settings, label: "Settings" },
  { icon: Bell, label: "Reminders" },
  { icon: HelpCircle, label: "Help & Support" },
  { icon: LogOut, label: "Logout" },
];

function Profile() {
  return (
    <MobileFrame>
      <div className="bg-gradient-purple text-white pb-8 rounded-b-[2rem]">
        <StatusBar light />
        <div className="px-6 pt-2">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex flex-col items-center mt-4">
            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur border-4 border-white/30 flex items-center justify-center overflow-hidden">
              <User className="h-12 w-12 text-white" />
            </div>
            <p className="mt-3 text-lg font-semibold">Alex</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60 flex items-center justify-between mb-6">
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

        <div className="space-y-2">
          {menu.map(({ icon: Icon, label }) => (
            <button key={label} className="w-full bg-card rounded-2xl p-4 shadow-soft border border-border/60 flex items-center gap-3 active:scale-[0.99] transition-transform">
              <span className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </span>
              <span className="flex-1 text-left text-sm font-semibold">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}