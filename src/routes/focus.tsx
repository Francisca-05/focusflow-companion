import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from "@/components/focusflow/MobileFrame";
import { ArrowLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/focus")({
  head: () => ({ meta: [{ title: "FocusFlow — Focus" }] }),
  component: Focus,
});

function Focus() {
  const router = useRouter();
  const TOTAL = 45 * 60;
  const [seconds, setSeconds] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [focusMode, setFocusMode] = useState(true);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = 1 - seconds / TOTAL;
  const C = 2 * Math.PI * 110;

  return (
    <div className="min-h-screen w-full flex justify-center bg-primary-deep">
      <div className="w-full max-w-[440px] min-h-screen relative flex flex-col bg-gradient-purple text-white">
        <StatusBar light />
        <div className="px-6 pt-2 pb-4">
          <button onClick={() => router.history.back()} className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur active:scale-95 transition-transform">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="text-lg font-semibold mb-10">Study Session</p>
          <div className="relative h-64 w-64 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r="110" stroke="rgba(255,255,255,0.15)" strokeWidth="6" fill="none" />
              <circle
                cx="120" cy="120" r="110"
                stroke="white" strokeWidth="6" fill="none" strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="text-center">
              <p className="text-5xl font-bold tabular-nums tracking-tight">{mm}:{ss}</p>
              <p className="text-xs text-white/70 mt-2">Focus on your goal</p>
            </div>
          </div>
          <button
            onClick={() => setRunning((r) => !r)}
            className="mt-10 px-10 py-3.5 bg-white text-primary font-semibold rounded-2xl shadow-xl active:scale-95 transition-transform"
          >
            {running ? "Pause" : "Start Focus"}
          </button>
        </div>

        <div className="px-6 pb-8 space-y-3">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Today's Goal</p>
              <p className="text-xs text-white/70 mt-0.5">2 / 3 sessions</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/70" />
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center justify-between">
            <p className="text-sm font-semibold">Focus Mode</p>
            <button
              onClick={() => setFocusMode((f) => !f)}
              className={`h-7 w-12 rounded-full relative transition-colors ${focusMode ? "bg-white" : "bg-white/30"}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full transition-all ${focusMode ? "left-6 bg-primary" : "left-1 bg-white"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}