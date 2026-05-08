import { createFileRoute } from "@tanstack/react-router";
import { MobileFrame } from "@/components/focusflow/MobileFrame";
import { PageHeader } from "@/components/focusflow/PageHeader";
import { useStore } from "@/lib/store";
import { useAuthGuard } from "@/lib/guard";

export const Route = createFileRoute("/reminders")({
  head: () => ({ meta: [{ title: "FocusFlow — Reminders" }] }),
  component: Reminders,
});

function Reminders() {
  useAuthGuard();
  const { settings, updateSettings } = useStore();
  return (
    <MobileFrame>
      <PageHeader title="Reminders" />
      <div className="flex-1 px-6 pb-8 overflow-y-auto space-y-3">
        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Daily Reminder</p>
            <p className="text-xs text-muted-foreground mt-0.5">Get a nudge to start focusing</p>
          </div>
          <button
            onClick={() => updateSettings({ remindersEnabled: !settings.remindersEnabled })}
            className={`h-6 w-11 rounded-full relative transition-colors ${settings.remindersEnabled ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${settings.remindersEnabled ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
          <p className="text-sm font-semibold mb-2">Reminder Time</p>
          <input
            type="time"
            value={settings.reminderTime}
            onChange={(e) => updateSettings({ reminderTime: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm"
          />
        </div>
      </div>
    </MobileFrame>
  );
}
