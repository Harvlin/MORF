import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import { currentUser, sportRecommendations } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/reassess")({
  component: Reassess,
});

function Reassess() {
  const [stage, setStage] = useState<"welcome" | "result">("welcome");
  const navigate = useNavigate();

  if (stage === "welcome") {
    return (
      <div className="min-h-dvh bg-background flex flex-col px-5 py-8">
        <Link
          to="/dashboard"
          className="w-10 h-10 -ml-2 grid place-items-center rounded-lg hover:bg-surface-3 self-start"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-full bg-secondary-light grid place-items-center mb-6 text-secondary"
          >
            <Sparkles size={22} />
          </motion.div>
          <h1 className="text-4xl font-semibold mb-3">Welcome back, {currentUser.name}</h1>
          <p className="text-text-2 mb-6">
            A lot can change in 30 days. Let's see how you've grown.
          </p>
          <div className="bg-surface border border-border rounded-2xl px-5 py-4 mb-8">
            <div className="text-xs uppercase tracking-widest text-text-2 mb-1">
              You started with
            </div>
            <div className="text-2xl font-semibold flex items-center justify-center gap-2">
              <span className="w-9 h-9 rounded-full bg-surface-3 border border-border text-[11px] font-semibold grid place-items-center text-text-2">
                {getInitials("Badminton")}
              </span>
              Badminton
            </div>
          </div>
          <button
            onClick={() => setStage("result")}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Update my profile
          </button>
          <Link to="/dashboard" className="mt-3 text-sm text-text-2 hover:text-text-1">
            Keep my current profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background px-5 py-8">
      <Link
        to="/dashboard"
        className="w-10 h-10 -ml-2 grid place-items-center rounded-lg hover:bg-surface-3 mb-4"
        aria-label="Back"
      >
        <ChevronLeft size={20} />
      </Link>
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center gap-2 bg-secondary-light text-secondary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Sparkles size={12} /> Comparison ready
        </div>
        <h1 className="text-3xl font-semibold mb-2">You've evolved</h1>
        <p className="text-text-2 mb-6">
          Your taste hasn't changed — but your level has. We've leveled up your roadmap.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-surface-3 border border-border rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-text-2 mb-2">Before</div>
            <div className="w-9 h-9 rounded-full bg-surface border border-border text-[11px] font-semibold grid place-items-center text-text-2 mb-2">
              {getInitials("Badminton")}
            </div>
            <div className="font-semibold">Badminton</div>
            <div className="text-xs text-text-2 mt-1">Beginner</div>
          </div>
          <div className="bg-primary-light border border-primary rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-primary mb-2">Now</div>
            <div className="w-9 h-9 rounded-full bg-surface border border-primary text-[11px] font-semibold grid place-items-center text-primary mb-2">
              {getInitials("Badminton")}
            </div>
            <div className="font-semibold">Badminton</div>
            <div className="text-xs text-primary mt-1">Intermediate</div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 mb-6">
          <div className="text-xs uppercase tracking-widest text-text-2 mb-2">
            New recommendations
          </div>
          {sportRecommendations.slice(0, 2).map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-2">
              <span className="w-8 h-8 rounded-full bg-surface-3 border border-border text-[11px] font-semibold grid place-items-center text-text-2">
                {getInitials(s.name)}
              </span>
              <div className="font-medium text-sm">{s.name}</div>
              <span className="ml-auto text-[10px] font-semibold bg-secondary-light text-secondary px-2 py-0.5 rounded-full uppercase tracking-wider">
                {s.difficulty}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Start fresh with new plan
          </button>
          <Link to="/dashboard" className="block text-center text-sm text-text-2 hover:text-text-1">
            Keep my current plan
          </Link>
        </div>
      </div>
    </div>
  );
}
