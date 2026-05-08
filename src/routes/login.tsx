import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/focusflow/MobileFrame";
import { Flame } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "FocusFlow — Login" }] }),
  component: Login,
});

function Login() {
  const { signIn } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const derivedName = name || email.split("@")[0];
    signIn({ name: derivedName, email });
    navigate({ to: "/home" });
  };

  return (
    <MobileFrame variant="purple">
      <div className="flex-1 flex flex-col px-7 pt-12 pb-8 text-white overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shadow-xl mb-4">
            <Flame className="h-8 w-8 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold">FocusFlow</h1>
          <p className="text-sm text-white/70 mt-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-white/15 backdrop-blur placeholder-white/60 text-white px-4 py-3.5 rounded-2xl outline-none border border-white/20 focus:border-white/50"
          />
          <button
            type="submit"
            className="w-full bg-white text-primary font-semibold py-3.5 rounded-2xl shadow-button active:scale-[0.98] transition-transform mt-2"
          >
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 text-sm text-white/80 underline-offset-2 hover:underline"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </MobileFrame>
  );
}
