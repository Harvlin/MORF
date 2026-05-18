import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, User, Check } from "lucide-react";
import { AuthShell, AuthInput, AuthLabel } from "@/components/AuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Athena" }] }),
  component: SignupPage,
});

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const labels = ["", "Weak", "Fair", "Good", "Strong"];
const colors = ["bg-white/10", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400"];

function SignupPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const s = strength(pw);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    nav({ to: "/onboarding" });
  };

  const canSubmit = name && email && pw.length >= 8 && agreed && !loading;

  return (
    <AuthShell>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-medium text-white">Create your account</h1>
        <p className="text-sm text-white/60 mt-1.5">
          Start your inclusive sports journey in 60 seconds.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <AuthLabel>Full name</AuthLabel>
            <AuthInput
              icon={User}
              placeholder="Your name"
              value={name}
              onChange={setName}
              autoComplete="name"
            />
          </div>
          <div>
            <AuthLabel>Email</AuthLabel>
            <AuthInput
              icon={Mail}
              type="email"
              placeholder="you@athena.app"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
          </div>
          <div>
            <AuthLabel>Password</AuthLabel>
            <AuthInput
              icon={Lock}
              type={showPw ? "text" : "password"}
              placeholder="At least 8 characters"
              value={pw}
              onChange={setPw}
              autoComplete="new-password"
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
            {pw && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-0.5 rounded-full transition-colors ${i <= s ? colors[s] : "bg-white/10"}`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-white/55 w-12 text-right">{labels[s]}</span>
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              aria-checked={agreed}
              role="checkbox"
              className={`w-4 h-4 rounded border mt-0.5 grid place-items-center flex-shrink-0 transition-colors ${agreed ? "bg-[#E8593C] border-[#E8593C]" : "border-white/30 bg-white/5"}`}
            >
              {agreed && <Check size={11} className="text-white" strokeWidth={3} />}
            </button>
            <span className="text-xs text-white/55 leading-relaxed">
              I agree to Athena's{" "}
              <a href="#" className="text-white/80 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-white/80 hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 rounded-xl bg-[#E8593C] hover:bg-[#D44E33] text-white text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Creating your account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-sm text-white/55 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#F06B4F] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
