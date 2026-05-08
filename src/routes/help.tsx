import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/focusflow/MobileFrame";
import { PageHeader } from "@/components/focusflow/PageHeader";
import { ChevronDown } from "lucide-react";
import { useAuthGuard } from "@/lib/guard";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "FocusFlow — Help" }] }),
  component: Help,
});

const faqs = [
  { q: "How does the focus timer work?", a: "Pick a task, start the timer, and stay on the screen until your session ends." },
  { q: "How is my streak calculated?", a: "Complete at least one focus session per day to keep your streak going." },
  { q: "Can I change session length?", a: "Yes — set the default in Settings or per-task when adding a new task." },
  { q: "Is my data saved?", a: "Yes, all your tasks and sessions are stored locally on your device." },
];

function Help() {
  useAuthGuard();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <MobileFrame>
      <PageHeader title="Help & Support" />
      <div className="flex-1 px-6 pb-8 overflow-y-auto space-y-2">
        {faqs.map((f, i) => (
          <div key={i} className="bg-card rounded-2xl shadow-soft border border-border/60 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <span className="text-sm font-semibold pr-3">{f.q}</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>}
          </div>
        ))}
        <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60 mt-4">
          <p className="text-sm font-semibold">Still need help?</p>
          <p className="text-xs text-muted-foreground mt-1">Reach us at support@focusflow.app</p>
        </div>
      </div>
    </MobileFrame>
  );
}
