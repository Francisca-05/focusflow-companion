import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuthGuard } from "@/lib/guard";

export const Route = createFileRoute("/focus")({
  head: () => ({ meta: [{ title: "FocusFlow — Focus" }] }),
  component: Focus,
});

function Focus() {
  useAuthGuard();
  const router = useRouter();
  const { tasks, settings, addSession } = useStore();
  const todayTask = tasks.find((t) => !t.done);
  const minutes = todayTask?.duration ?? settings.defaultDuration;
  const TOTAL = minutes * 60;
  const [seconds, setSeconds] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [focusMode, setFocusMode] = useState(true);
  const ref = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => { setSeconds(TOTAL); completedRef.current = false; }, [TOTAL]);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1 && !completedRef.current) {
          completedRef.current = true;
          addSession(minutes);
          setRunning(false);
          return 0;
        }
        return s > 0 ? s - 1 : 0;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, minutes, addSession]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = 1 - seconds / TOTAL;
  const C = 2 * Math.PI * 110;

  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-primary-deep/5">
      <div className="w-full sm:max-w-[440px] min-h-[100dvh] relative flex flex-col bg-gradient-purple text-white sm:my-4 sm:rounded-[2.5rem] sm:shadow-2xl sm:overflow-hidden sm:min-h-[calc(100dvh-2rem)]">
        <div className="px-6 pt-8 pb-4 flex items-center justify-between">
          <button onClick={() => router.history.back()} className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur active:scale-95 transition-transform">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button onClick={() => { setRunning(false); setSeconds(TOTAL); }} className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur active:scale-95 transition-transform">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="text-lg font-semibold mb-10">{todayTask?.title ?? "Focus Session"}</p>
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
            className="hover-glow mt-10 px-10 py-3.5 bg-white text-primary font-semibold rounded-2xl shadow-xl active:scale-95 hover:scale-105 transition-transform animate-glow"
          >
            {seconds === 0 ? "Done" : running ? "Pause" : "Start Focus"}
          </button>
        </div>

        <div className="px-6 pb-8 space-y-3">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Today's Goal</p>
              <p className="text-xs text-white/70 mt-0.5">{tasks.filter((t) => t.done).length} / {Math.max(tasks.length, 1)} tasks</p>
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