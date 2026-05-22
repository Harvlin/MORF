import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { AuthShell, AuthInput, AuthLabel } from "@/components/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — MORF" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    if (password.length < 4) {
      setLoading(false);
      setError("Those credentials don't match. Try again.");
      setShake((s) => s + 1);
      return;
    }
    nav({ to: "/dashboard" });
  };

  return (
    <AuthShell>
      <motion.div
        key={shake}
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-black" style={{ color: "#F2F0E9" }}>Welcome back</h1>
        <p className="text-sm mt-1.5 font-medium" style={{ color: "rgba(242,240,233,0.45)" }}>
          Sign in to continue your journey.
        </p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl px-4 py-3 mt-5 flex items-start gap-2.5 text-sm"
              style={{
                border: "1px solid rgba(245,82,42,0.25)",
                background: "rgba(245,82,42,0.08)",
                color: "#F5522A",
              }}
            >
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <AuthLabel>Email</AuthLabel>
            <AuthInput
              icon={Mail}
              type="email"
              placeholder="you@morf.app"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              error={!!error}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <AuthLabel>Password</AuthLabel>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold transition-colors"
                style={{ color: "rgba(242,240,233,0.4)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#D6E800")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,240,233,0.4)")}
              >
                Forgot password?
              </Link>
            </div>
            <AuthInput
              icon={Lock}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              error={!!error}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="w-8 h-8 grid place-items-center rounded-lg transition-colors"
                  style={{ color: "rgba(242,240,233,0.35)" }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            style={{
              background: "#D6E800",
              color: "#1C1C1A",
              boxShadow: !loading && email && password ? "0 0 28px rgba(214,232,0,0.25)" : "none",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px" style={{ background: "rgba(242,240,233,0.07)" }} />
          <span className="text-xs font-medium" style={{ color: "rgba(242,240,233,0.3)" }}>or</span>
          <span className="flex-1 h-px" style={{ background: "rgba(242,240,233,0.07)" }} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["Google", "Apple"].map((p) => (
            <button
              key={p}
              className="rounded-xl h-11 text-sm font-semibold transition-all"
              style={{
                background: "rgba(242,240,233,0.05)",
                border: "1px solid rgba(242,240,233,0.08)",
                color: "rgba(242,240,233,0.65)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(242,240,233,0.08)";
                e.currentTarget.style.color = "#F2F0E9";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(242,240,233,0.05)";
                e.currentTarget.style.color = "rgba(242,240,233,0.65)";
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <p className="text-sm text-center mt-7" style={{ color: "rgba(242,240,233,0.4)" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold transition-colors"
            style={{ color: "#D6E800" }}
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
