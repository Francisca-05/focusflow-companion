import { createFileRoute } from "@tanstack/react-router";
import { MobileFrame } from "@/components/focusflow/MobileFrame";
import { PageHeader } from "@/components/focusflow/PageHeader";
import { useStore } from "@/lib/store";
import { useAuthGuard } from "@/lib/guard";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "FocusFlow — Settings" }] }),
  component: SettingsPage,
});

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full relative transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function SettingsPage() {
  useAuthGuard();
  const { settings, updateSettings } = useStore();
  return (
    <MobileFrame>
      <PageHeader title="Settings" />
      <div className="flex-1 px-6 pb-8 overflow-y-auto space-y-3">
        {[
          { key: "notifications", label: "Notifications" },
          { key: "sound", label: "Sound" },
          { key: "darkMode", label: "Dark Mode" },
        ].map((item) => (
          <div key={item.key} className="bg-card rounded-2xl p-4 shadow-soft border border-border/60 flex items-center justify-between">
            <span className="text-sm font-semibold">{item.label}</span>
            <Toggle
              checked={settings[item.key as "notifications" | "sound" | "darkMode"]}
              onChange={(v) => updateSettings({ [item.key]: v })}
            />
          </div>
        ))}
        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Default Focus Duration</span>
            <span className="text-sm text-muted-foreground">{settings.defaultDuration} min</span>
          </div>
          <input
            type="range"
            min={5}
            max={120}
            step={5}
            value={settings.defaultDuration}
            onChange={(e) => updateSettings({ defaultDuration: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
      </div>
    </MobileFrame>
  );
}
