import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/focusflow/MobileFrame";
import { Flame, Eye, EyeOff } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "FocusFlow — Login" }] }),
  component: Login,
});

function Login() {
  const { signIn, signUp } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError("Email and password are required."); return; }
    const res = mode === "login"
      ? signIn(email, password)
      : signUp(name || email.split("@")[0], email, password);
    if (!res.ok) { setError(res.error ?? "Something went wrong."); return; }
    navigate({ to: "/home" });
  };

  return (
    <MobileFrame variant="purple">
      <div className="flex-1 flex flex-col px-7 pt-12 pb-8 text-white overflow-y-auto animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shadow-xl mb-4 animate-float">
            <Flame className="h-8 w-8 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">FocusFlow</h1>
          <p className="text-sm text-white/70 mt-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3 stagger">
          {mode === "signup" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-white/15 backdrop-blur placeholder-white/60 text-white px-4 py-3.5 rounded-2xl outline-none border border-white/20 focus:border-white/50"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full bg-white/15 backdrop-blur placeholder-white/60 text-white px-4 py-3.5 rounded-2xl outline-none border border-white/20 focus:border-white/50"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-white/15 backdrop-blur placeholder-white/60 text-white px-4 py-3.5 pr-12 rounded-2xl outline-none border border-white/20 focus:border-white/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-white/80 hover:text-white press"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {error && (
            <p className="text-xs text-white bg-destructive/90 rounded-xl px-3 py-2 animate-pop">{error}</p>
          )}
          {mode === "login" && (
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-white/80 hover:text-white underline-offset-2 hover:underline">
                Forgot password?
              </Link>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-white text-primary font-semibold py-3.5 rounded-2xl shadow-button active:scale-[0.98] transition-transform mt-2 animate-glow"
          >
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
          className="mt-6 text-sm text-white/80 underline-offset-2 hover:underline"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </MobileFrame>
  );
}
