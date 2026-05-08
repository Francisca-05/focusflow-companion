import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Task = { id: string; title: string; duration: number; done: boolean; createdAt: number };
export type Session = { id: string; date: string; minutes: number };
export type User = { name: string; email: string };
export type Settings = {
  notifications: boolean;
  sound: boolean;
  darkMode: boolean;
  defaultDuration: number;
  reminderTime: string;
  remindersEnabled: boolean;
};

type State = {
  user: User | null;
  tasks: Task[];
  sessions: Session[];
  settings: Settings;
  streak: number;
};

type Ctx = State & {
  signIn: (u: User) => void;
  signOut: () => void;
  addTask: (title: string, duration: number) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  addSession: (minutes: number) => void;
  updateSettings: (s: Partial<Settings>) => void;
  todayMinutes: () => number;
  weeklyMinutes: () => number[];
};

const KEY = "focusflow:v1";
const defaultSettings: Settings = {
  notifications: true,
  sound: true,
  darkMode: false,
  defaultDuration: 45,
  reminderTime: "09:00",
  remindersEnabled: true,
};
const initial: State = { user: null, tasks: [], sessions: [], settings: defaultSettings, streak: 0 };

const StoreCtx = createContext<Ctx | null>(null);

function load(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch { return initial; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setState(load()); setHydrated(true); }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const signIn = (user: User) => setState((s) => ({ ...s, user }));
  const signOut = () => setState((s) => ({ ...s, user: null }));
  const addTask = (title: string, duration: number) =>
    setState((s) => ({ ...s, tasks: [{ id: crypto.randomUUID(), title, duration, done: false, createdAt: Date.now() }, ...s.tasks] }));
  const toggleTask = (id: string) =>
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t) }));
  const removeTask = (id: string) =>
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  const addSession = (minutes: number) =>
    setState((s) => ({ ...s, sessions: [...s.sessions, { id: crypto.randomUUID(), date: new Date().toISOString(), minutes }] }));
  const updateSettings = (p: Partial<Settings>) =>
    setState((s) => ({ ...s, settings: { ...s.settings, ...p } }));

  const todayMinutes = useCallback(() => {
    const today = new Date().toDateString();
    return state.sessions.filter((s) => new Date(s.date).toDateString() === today).reduce((a, b) => a + b.minutes, 0);
  }, [state.sessions]);

  const weeklyMinutes = useCallback(() => {
    const arr = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();
    state.sessions.forEach((s) => {
      const d = new Date(s.date);
      const diff = Math.floor((+now - +d) / 86400000);
      if (diff >= 0 && diff < 7) {
        const idx = 6 - diff;
        arr[idx] += s.minutes;
      }
    });
    return arr;
  }, [state.sessions]);

  return (
    <StoreCtx.Provider value={{ ...state, signIn, signOut, addTask, toggleTask, removeTask, addSession, updateSettings, todayMinutes, weeklyMinutes }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be inside StoreProvider");
  return c;
}