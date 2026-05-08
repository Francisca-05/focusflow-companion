import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/focusflow/MobileFrame";
import { Eye, EyeOff, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "FocusFlow — Reset Password" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const { resetPassword } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Passwords do not match."); return; }
    const res = resetPassword(email, password);
    if (!res.ok) { setError(res.error ?? "Could not reset password."); return; }
    setDone(true);
    setTimeout(() => navigate({ to: "/login" }), 1400);
  };

  return (
    <MobileFrame variant="purple">
      <div className="flex-1 flex flex-col px-7 pt-10 pb-8 text-white overflow-y-auto animate-fade-in">
        <Link to="/login" className="h-10 w-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center press mb-6">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shadow-xl mb-4 animate-float">
            <KeyRound className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-white/70 mt-1 text-center">Enter your email and a new password.</p>
        </div>

        {done ? (
          <div className="bg-white/15 backdrop-blur rounded-2xl p-6 flex flex-col items-center gap-3 animate-pop">
            <CheckCircle2 className="h-10 w-10 text-white" />
            <p className="text-center font-semibold">Password updated! Redirecting…</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3 stagger">
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
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                required
                className="w-full bg-white/15 backdrop-blur placeholder-white/60 text-white px-4 py-3.5 pr-12 rounded-2xl outline-none border border-white/20 focus:border-white/50"
              />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-white/80 press">
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full bg-white/15 backdrop-blur placeholder-white/60 text-white px-4 py-3.5 rounded-2xl outline-none border border-white/20 focus:border-white/50"
            />
            {error && <p className="text-xs text-white bg-destructive/90 rounded-xl px-3 py-2 animate-pop">{error}</p>}
            <button type="submit" className="w-full bg-white text-primary font-semibold py-3.5 rounded-2xl shadow-button active:scale-[0.98] transition-transform mt-2">
              Update Password
            </button>
          </form>
        )}
      </div>
    </MobileFrame>
  );
}
