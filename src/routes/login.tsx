import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { AuthShell, AuthInput, AuthLabel } from "@/components/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Athena" }] }),
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
        <h1 className="text-2xl font-medium text-white">Welcome back</h1>
        <p className="text-sm text-white/60 mt-1.5">Sign in to continue your journey.</p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="liquid-glass rounded-xl px-4 py-3 mt-5 flex items-start gap-2.5 text-sm text-red-300"
              style={{ background: "rgba(220, 60, 60, 0.08)" }}
            >
              <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
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
              placeholder="you@athena.app"
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
                className="text-xs text-white/55 hover:text-white/85 transition-colors"
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
                  className="w-8 h-8 grid place-items-center rounded-md text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full h-12 rounded-xl bg-[#E8593C] hover:bg-[#D44E33] text-white text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
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
          <span className="flex-1 h-px bg-white/15" />
          <span className="text-xs text-white/35">or</span>
          <span className="flex-1 h-px bg-white/15" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["Google", "Apple"].map((p) => (
            <button
              key={p}
              className="liquid-glass rounded-xl h-11 text-sm text-white/85 hover:text-white transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <p className="text-sm text-white/55 text-center mt-7">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#F06B4F] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
