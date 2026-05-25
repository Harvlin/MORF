import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { AuthShell, AuthInput, AuthLabel } from "@/components/AuthShell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Athena" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthShell>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="form" exit={{ opacity: 0 }}>
            <h1 className="text-2xl font-medium text-foreground">Reset your password</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Enter your email and we'll send you a reset link.
            </p>
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
                />
              </div>
              <button
                type="submit"
                disabled={!email || loading}
                className="w-full h-12 rounded-xl bg-[#E8593C] hover:bg-[#D44E33] text-foreground text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
            <p className="text-sm text-muted-foreground text-center mt-6">
              Remembered?{" "}
              <Link to="/login" className="text-[#F06B4F] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <div className="w-14 h-14 rounded-full bg-green-400/15 grid place-items-center mx-auto mb-5">
              <CheckCircle size={24} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-medium text-foreground">Check your email</h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              We sent a reset link to <span className="text-foreground">{email}</span>. The link expires
              in 1 hour.
            </p>
            <Link
              to="/login"
              className="inline-block mt-7 text-sm text-[#F06B4F] hover:underline font-medium"
            >
              Back to sign in
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
