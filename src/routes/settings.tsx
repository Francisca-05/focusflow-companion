import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { MobileFrame } from "@/components/focusflow/MobileFrame";
import { PageHeader } from "@/components/focusflow/PageHeader";
import { useStore } from "@/lib/store";
import { useAuthGuard } from "@/lib/guard";
import { Camera, User, Check } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "FocusFlow — Settings" }] }),
  component: SettingsPage,
});

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`h-7 w-12 rounded-full relative transition-all duration-300 ${checked ? "bg-primary shadow-button" : "bg-muted"}`}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all duration-300 ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function SettingsPage() {
  useAuthGuard();
  const { user, settings, updateSettings, updateProfile } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatar: String(reader.result) });
    reader.readAsDataURL(f);
  };

  const saveName = () => {
    if (!name.trim()) return;
    updateProfile({ name: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <MobileFrame>
      <PageHeader title="Settings" />
      <div className="flex-1 px-6 pb-8 overflow-y-auto space-y-3 stagger">
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/60 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-purple flex items-center justify-center overflow-hidden shadow-button animate-glow">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-white" />
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-button press"
              aria-label="Change profile picture"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />
          </div>
          <p className="text-xs text-muted-foreground">Tap the camera to change your photo</p>

          <div className="w-full mt-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</label>
            <div className="flex gap-2 mt-1.5">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="flex-1 px-4 py-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={saveName}
                className="px-4 py-3 rounded-2xl bg-gradient-button text-primary-foreground text-sm font-semibold shadow-button press flex items-center gap-1"
              >
                {saved ? <><Check className="h-4 w-4" /> Saved</> : "Save"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{user?.email}</p>
          </div>
        </div>

        {[
          { key: "notifications", label: "Notifications" },
          { key: "sound", label: "Sound" },
          { key: "darkMode", label: "Dark Mode" },
        ].map((item) => (
          <div key={item.key} className="bg-card rounded-2xl p-4 shadow-soft border border-border/60 flex items-center justify-between hover:shadow-card transition-shadow">
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
            <span className="text-sm text-primary font-bold">{settings.defaultDuration} min</span>
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
