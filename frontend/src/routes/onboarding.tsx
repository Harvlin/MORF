import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, type ComponentType } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  HeartPulse,
  Flame,
  Dumbbell,
  Users,
  Shield,
  Sparkles,
  Accessibility,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sportRecommendations } from "@/lib/mock-data";
import { cn, getInitials } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

const goalOptions = [
  { id: "health", label: "General health", icon: HeartPulse },
  { id: "weight", label: "Lose weight", icon: Flame },
  { id: "strength", label: "Build strength", icon: Dumbbell },
  { id: "social", label: "Have fun & socialize", icon: Users },
  { id: "recovery", label: "Recover from injury", icon: Shield },
  { id: "stress", label: "Reduce stress", icon: Sparkles },
];

const fitnessLevels = ["Complete beginner", "Rarely active", "Sometimes active", "Pretty active"];
const locations = ["Home", "Gym", "Outdoors", "Mix of all"];
const times = ["1–2 hrs", "3–5 hrs", "5+ hrs"];
const confidenceLevels = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "High" },
];
const physicalOptions = [
  "None",
  "Joint issues",
  "Back pain",
  "Post-injury",
  "Chronic condition",
  "Prefer not to say",
];
const socialOptions = ["Solo", "With a partner", "Small group", "Any is fine"];

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const onboarding = useApp((s) => s.onboarding);
  const setOnboarding = useApp((s) => s.setOnboarding);
  const navigate = useNavigate();

  const phrases = [
    "Analyzing your profile...",
    "Finding sports you'll actually enjoy...",
    "Building your starter roadmap...",
  ];

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setPhraseIdx((i) => (i + 1) % phrases.length), 800);
    const timeout = setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 2500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loading]);

  const next = () => {
    if (step === 3) {
      setLoading(true);
      setStep(4);
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(4, s + 1));
  };
  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };

  const canContinue = (() => {
    if (step === 1) return onboarding.goals.length > 0;
    if (step === 2)
      return (
        onboarding.fitnessLevel &&
        onboarding.location &&
        onboarding.timePerWeek &&
        onboarding.confidence
      );
    if (step === 3) return onboarding.physical.length > 0 && onboarding.social;
    return true;
  })();

  const progress = step / 4;

  return (
    <div className="min-h-dvh flex flex-col text-white">
      <div className="h-1 bg-[rgba(255,255,255,0.2)]">
        <motion.div
          className="h-full bg-white"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        {step > 1 && step < 4 ? (
          <button
            onClick={back}
            className="w-10 h-10 grid place-items-center rounded-lg hover:bg-[rgba(255,255,255,0.1)]"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-10" />
        )}
        {step === 1 && (
          <Link to="/dashboard" className="text-sm text-[rgba(255,255,255,0.7)] hover:text-white">
            Skip
          </Link>
        )}
      </div>

      <div className="flex-1 flex justify-center px-5 pb-12">
        <div className="w-full max-w-[480px]">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && !loading && !showResult && (
              <motion.div key="s1" {...slide(direction)}>
                <h1 className="text-3xl sm:text-4xl font-semibold mb-2">What brings you here?</h1>
                <p className="text-[rgba(255,255,255,0.8)] mb-8">
                  Pick everything that applies. We'll personalize from here.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map((g) => {
                    const active = onboarding.goals.includes(g.id);
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.id}
                        onClick={() =>
                          setOnboarding({
                            goals: active
                              ? onboarding.goals.filter((x) => x !== g.id)
                              : [...onboarding.goals, g.id],
                          })
                        }
                        className={cn(
                          "p-5 rounded-[28px] border text-left transition-all active:scale-[0.97]",
                          active
                            ? "bg-white text-[#1a3d35] border-white shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
                            : "bg-[rgba(255,255,255,0.6)] text-[#0f2420] border-transparent hover:bg-[rgba(255,255,255,0.75)] backdrop-blur-md",
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-xl grid place-items-center mb-2 transition-colors",
                          active ? "bg-[#f0f5f2] text-[#1a3d35]" : "bg-[rgba(255,255,255,0.4)] text-[#1a3d35]"
                        )}>
                          <Icon size={18} />
                        </div>
                        <div className="font-semibold text-[15px] leading-tight">{g.label}</div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" {...slide(direction)} className="space-y-7">
                <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-white">Tell us about yourself</h1>
                <Pills
                  label="Fitness level"
                  options={fitnessLevels}
                  value={onboarding.fitnessLevel}
                  onChange={(v) => setOnboarding({ fitnessLevel: v })}
                />
                <Pills
                  label="Where you prefer to work out"
                  options={locations}
                  value={onboarding.location}
                  onChange={(v) => setOnboarding({ location: v })}
                />
                <Pills
                  label="How much time per week"
                  options={times}
                  value={onboarding.timePerWeek}
                  onChange={(v) => setOnboarding({ timePerWeek: v })}
                />
                <div>
                  <div className="text-sm font-medium mb-3 text-white">How do you feel about exercise?</div>
                  <div className="grid grid-cols-5 gap-2">
                    {confidenceLevels.map((c) => {
                      const active = onboarding.confidence === c.value;
                      return (
                        <button
                          key={c.value}
                          onClick={() => setOnboarding({ confidence: c.value })}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1 h-14 rounded-xl border-2 transition-all active:scale-95",
                            active
                              ? "bg-white text-[#1a3d35] border-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                              : "bg-[rgba(255,255,255,0.4)] text-white border-transparent hover:bg-[rgba(255,255,255,0.6)] backdrop-blur-md",
                          )}
                        >
                          <span className={cn("text-sm font-semibold", active ? "text-[#1a3d35]" : "text-white")}>{c.value}</span>
                          <span className={cn("text-[10px] leading-tight", active ? "text-[#1a3d35]" : "text-[rgba(255,255,255,0.8)]")}>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" {...slide(direction)} className="space-y-7">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-semibold text-white">We want to get this right</h1>
                  <p className="text-[rgba(255,255,255,0.8)] mt-2">This helps us personalize your experience.</p>
                </div>
                <div>
                  <div className="text-sm font-medium mb-3 text-white">Any physical considerations?</div>
                  <div className="flex flex-wrap gap-2">
                    {physicalOptions.map((p) => {
                      const active = onboarding.physical.includes(p);
                      return (
                        <button
                          key={p}
                          onClick={() =>
                            setOnboarding({
                              physical: active
                                ? onboarding.physical.filter((x) => x !== p)
                                : [...onboarding.physical, p],
                            })
                          }
                          className={cn(
                            "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all active:scale-95",
                            active
                              ? "bg-white border-white text-[#1a3d35] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                              : "bg-[rgba(255,255,255,0.4)] border-transparent text-white backdrop-blur-md",
                          )}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <ConditionDetailCards selected={onboarding.physical} />
                </div>
                <Pills
                  label="Social preference"
                  options={socialOptions}
                  value={onboarding.social}
                  onChange={(v) => setOnboarding({ social: v })}
                />
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">
                    Anything else we should know?
                  </label>
                  <textarea
                    placeholder="optional"
                    value={onboarding.notes}
                    onChange={(e) => setOnboarding({ notes: e.target.value })}
                    rows={3}
                    className="w-full bg-[rgba(255,255,255,0.4)] text-[#0f2420] border border-transparent rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:bg-white placeholder-[rgba(15,36,32,0.5)] transition-colors backdrop-blur-md"
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-[60vh] flex flex-col items-center justify-center text-center"
              >
                <motion.div
                  className="w-24 h-24 rounded-full bg-primary-light grid place-items-center mb-8"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary" />
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={phraseIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-text-2 text-lg"
                  >
                    {phrases[phraseIdx]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {showResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-white">
                  Here's what we think you'll love
                </h1>
                <p className="text-[rgba(255,255,255,0.8)] mb-8">Three sports tuned to your answers.</p>
                <div className="space-y-3 mb-8">
                  {sportRecommendations.map((sport) => (
                    <SportRecCard
                      key={sport.id}
                      sport={sport}
                      onPick={() => {
                        setOnboarding({ pickedSportId: sport.id });
                        navigate({ to: "/dashboard" });
                      }}
                    />
                  ))}
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-white">Your 4-week starter plan</h3>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
                    {[1, 2, 3, 4].map((w) => (
                      <div
                        key={w}
                        className="card-frosted shrink-0 w-44 p-4"
                      >
                        <div className="text-xs text-text-2 uppercase tracking-wider mb-1">
                          Week {w}
                        </div>
                        <div className="font-semibold text-sm mb-2">
                          {["Foundation", "Form & flow", "Build endurance", "Test yourself"][w - 1]}
                        </div>
                        <div className="text-xs text-text-2">
                          {
                            [
                              "3 sessions · light",
                              "3 sessions · moderate",
                              "4 sessions · moderate",
                              "3 sessions · push",
                            ][w - 1]
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="text-sm text-[rgba(255,255,255,0.7)] hover:text-white underline underline-offset-4 block mx-auto"
                >
                  I'll decide later
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!loading && !showResult && (
        <div className="sticky bottom-0 bg-[rgba(255,255,255,0.1)] backdrop-blur-xl border-t border-[rgba(255,255,255,0.2)] px-5 py-4">
          <div className="max-w-[480px] mx-auto">
            <button
              onClick={next}
              disabled={!canContinue}
              className={cn(
                "w-full h-[52px] rounded-full font-semibold text-[15px] transition-all flex items-center justify-center gap-2 active:scale-[0.98]",
                canContinue
                  ? "bg-white text-[#1a3d35] hover:opacity-90 shadow-lg"
                  : "bg-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.5)] cursor-not-allowed",
              )}
            >
              {step === 3 ? "Find my sports" : "Continue"} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function slide(dir: number) {
  return {
    initial: { x: dir * 30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: dir * -30, opacity: 0 },
    transition: { duration: 0.25, ease: "easeOut" as const },
  };
}

function Pills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium mb-3">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-medium transition-all active:scale-95",
                active
                  ? "bg-white border-white text-[#1a3d35] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                  : "bg-[rgba(255,255,255,0.4)] border-transparent text-white hover:bg-[rgba(255,255,255,0.6)] backdrop-blur-md",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SportRecCard({
  sport,
  onPick,
}: {
  sport: (typeof sportRecommendations)[0];
  onPick: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-frosted p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-9 h-9 rounded-full bg-surface-3 border border-border text-[11px] font-semibold grid place-items-center text-text-2"
              aria-hidden
            >
              {getInitials(sport.name)}
            </span>
            <h3 className="text-[24px] font-bold text-text-1">{sport.name}</h3>
          </div>
          <p className="text-sm italic text-text-2">{sport.reason}</p>
        </div>
        <span className="text-[10px] font-semibold bg-[#1a3d35] text-white px-2 py-1 rounded-full uppercase tracking-wider">
          {sport.difficulty}
        </span>
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-text-2 hover:text-text-1 flex items-center gap-1 mt-2"
      >
        Why this?{" "}
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-sm text-text-2 mt-3 overflow-hidden"
          >
            {sport.why}
          </motion.p>
        )}
      </AnimatePresence>
      <button
        onClick={onPick}
        className="w-full mt-4 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
      >
        Let's start with {sport.name}
      </button>
    </div>
  );
}

const conditionMeta: Record<
  string,
  {
    icon: ComponentType<{ size?: number; className?: string }>;
    subLabel?: string;
    subOptions?: string[];
    placeholder: string;
  }
> = {
  "Joint issues": {
    icon: Accessibility,
    subLabel: "Which joints?",
    subOptions: ["Knee", "Hip", "Shoulder", "Wrist", "Ankle", "Other"],
    placeholder: "e.g. deep squats, overhead press...",
  },
  "Back pain": {
    icon: Activity,
    subLabel: "Which area?",
    subOptions: ["Lower", "Upper", "Full back"],
    placeholder: "e.g. spinal flexion, heavy deadlifts...",
  },
  "Post-injury": {
    icon: ShieldAlert,
    subLabel: "Which body part?",
    placeholder: "Describe the area & current status...",
  },
  "Chronic condition": {
    icon: HeartPulse,
    subLabel: "What type?",
    subOptions: ["Diabetes", "Heart condition", "Asthma", "Other"],
    placeholder: "Any specific limits to mention...",
  },
};
const severities = ["mild", "moderate", "significant"] as const;

function ConditionDetailCards({ selected }: { selected: string[] }) {
  const details = useApp((s) => s.onboarding.physicalDetails);
  const set = useApp((s) => s.setPhysicalDetail);
  const conds = selected.filter((c) => c !== "None" && c !== "Prefer not to say");
  return (
    <AnimatePresence>
      {conds.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden mt-4"
        >
          {conds.map((c) => {
            const meta = conditionMeta[c];
            if (!meta) return null;
            const Icon = meta.icon;
            const d = details[c] ?? {};
            const selectedSubs = (d.details?.values as string[]) ?? [];
            return (
              <div key={c} className="card-frosted p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-text-2">
                    <Icon size={16} />
                  </span>
                  <span className="text-sm font-medium text-text-1">{c}</span>
                </div>
                {meta.subLabel && (
                  <div className="mb-3">
                    <div className="text-xs text-text-2 mb-2">{meta.subLabel}</div>
                    {meta.subOptions ? (
                      <div className="flex gap-2 flex-wrap">
                        {meta.subOptions.map((o) => {
                          const active = selectedSubs.includes(o);
                          return (
                            <button
                              key={o}
                              onClick={() => {
                                const next = active
                                  ? selectedSubs.filter((x) => x !== o)
                                  : [...selectedSubs, o];
                                set(c, { details: { values: next } });
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                active
                                  ? "bg-[#1a3d35] border-transparent text-white"
                                  : "bg-[rgba(255,255,255,0.4)] border-transparent text-[#0f2420] hover:bg-[rgba(255,255,255,0.6)]",
                              )}
                            >
                              {o}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={(d.details?.text as string) ?? ""}
                        onChange={(e) => set(c, { details: { text: e.target.value } })}
                        className="w-full h-10 bg-[rgba(255,255,255,0.4)] border border-transparent rounded-lg px-3 text-sm focus:outline-none focus:bg-white text-[#0f2420] placeholder-[rgba(15,36,32,0.5)] transition-colors"
                        placeholder="e.g. right knee, ACL recovery"
                      />
                    )}
                  </div>
                )}
                <div className="mb-3">
                  <div className="text-xs text-text-2 mb-2">Severity</div>
                  <div className="flex gap-2">
                    {severities.map((s) => {
                      const active = d.severity === s;
                      return (
                        <button
                          key={s}
                          onClick={() => set(c, { severity: s })}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize",
                            active
                              ? "bg-[#1a3d35] border-transparent text-white"
                              : "bg-[rgba(255,255,255,0.4)] border-transparent text-[#0f2420] hover:bg-[rgba(255,255,255,0.6)]",
                          )}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <textarea
                  value={d.avoidances ?? ""}
                  onChange={(e) => set(c, { avoidances: e.target.value })}
                  rows={2}
                  placeholder={meta.placeholder}
                  className="w-full bg-[rgba(255,255,255,0.4)] border border-transparent rounded-lg px-3 py-2 text-sm resize-none min-h-[72px] focus:outline-none focus:bg-white text-[#0f2420] placeholder-[rgba(15,36,32,0.5)] transition-colors"
                />
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
