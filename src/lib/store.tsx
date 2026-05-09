import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Task = { id: string; title: string; duration: number; done: boolean; createdAt: number };
export type Session = { id: string; date: string; minutes: number };
export type User = { name: string; email: string; avatar?: string };
export type Account = { name: string; email: string; password: string; avatar?: string };
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
  accounts: Account[];
  tasks: Task[];
  sessions: Session[];
  settings: Settings;
  streak: number;
};

type Ctx = State & {
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signUp: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
  updateProfile: (p: Partial<User>) => void;
  resetPassword: (email: string, newPassword: string) => { ok: boolean; error?: string };
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
const initial: State = { user: null, accounts: [], tasks: [], sessions: [], settings: defaultSettings, streak: 0 };

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

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", !!state.settings.darkMode);
  }, [state.settings.darkMode]);

  const signIn: Ctx["signIn"] = (email, password) => {
    const acc = state.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!acc) return { ok: false, error: "No account found for this email. Please sign up first." };
    if (acc.password !== password) return { ok: false, error: "Incorrect password." };
    setState((s) => ({ ...s, user: { name: acc.name, email: acc.email, avatar: acc.avatar } }));
    return { ok: true };
  };
  const signUp: Ctx["signUp"] = (name, email, password) => {
    if (!name.trim() || !email.trim() || !password) return { ok: false, error: "All fields are required." };
    const exists = state.accounts.some((a) => a.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false, error: "An account with this email already exists." };
    const acc: Account = { name: name.trim(), email: email.trim(), password };
    setState((s) => ({ ...s, accounts: [...s.accounts, acc], user: { name: acc.name, email: acc.email } }));
    return { ok: true };
  };
  const signOut = () => setState((s) => ({ ...s, user: null }));
  const updateProfile: Ctx["updateProfile"] = (p) =>
    setState((s) => {
      if (!s.user) return s;
      const user = { ...s.user, ...p };
      const accounts = s.accounts.map((a) => a.email === s.user!.email ? { ...a, name: user.name, avatar: user.avatar } : a);
      return { ...s, user, accounts };
    });
  const resetPassword: Ctx["resetPassword"] = (email, newPassword) => {
    const exists = state.accounts.some((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!exists) return { ok: false, error: "No account found for this email." };
    if (!newPassword || newPassword.length < 4) return { ok: false, error: "Password must be at least 4 characters." };
    setState((s) => ({ ...s, accounts: s.accounts.map((a) => a.email.toLowerCase() === email.toLowerCase() ? { ...a, password: newPassword } : a) }));
    return { ok: true };
  };
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
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    state.sessions.forEach((s) => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      const diff = Math.floor((+d - +startOfWeek) / 86400000);
      if (diff >= 0 && diff < 7) {
        const idx = diff;
        arr[idx] += s.minutes;
      }
    });
    return arr;
  }, [state.sessions]);

  return (
    <StoreCtx.Provider value={{ ...state, signIn, signUp, signOut, updateProfile, resetPassword, addTask, toggleTask, removeTask, addSession, updateSettings, todayMinutes, weeklyMinutes }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be inside StoreProvider");
  return c;
}