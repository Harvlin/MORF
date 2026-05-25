import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Check } from "lucide-react";
import { todayWorkout, motivationalCues } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/coach/workout/$sessionId/")({
  component: WorkoutSession,
});

type Phase = "warmup" | "exercise" | "rest" | "done";

function WorkoutSession() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("warmup");
  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [reps, setReps] = useState(0);
  const [restSec, setRestSec] = useState(60);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [setComplete, setSetComplete] = useState(false);
  const [cueIdx, setCueIdx] = useState(0);
  const restTimer = useRef<number | null>(null);
  const ex = todayWorkout.exercises[exIdx];
  const c = useColors();

  useEffect(() => {
    if (ex) setReps(ex.reps);
  }, [exIdx]);

  useEffect(() => {
    if (phase !== "rest") return;
    setRestSec(ex.rest);
    setCueIdx(Math.floor(Math.random() * motivationalCues.length));
    restTimer.current = window.setInterval(() => {
      setRestSec((s) => {
        if (s <= 1) {
          window.clearInterval(restTimer.current!);
          if ("vibrate" in navigator) navigator.vibrate(20);
          advanceAfterRest();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (restTimer.current) window.clearInterval(restTimer.current);
    };
  }, [phase]);

  const advanceAfterRest = () => {
    if (setIdx + 1 < ex.sets) {
      setSetIdx((i) => i + 1);
      setPhase("exercise");
    } else if (exIdx + 1 < todayWorkout.exercises.length) {
      setSetComplete(true);
      setTimeout(() => {
        setSetComplete(false);
        setExIdx((i) => i + 1);
        setSetIdx(0);
        setPhase("exercise");
      }, 1100);
    } else {
      navigate({ to: "/coach/workout/$sessionId/done", params: { sessionId } });
    }
  };

  const completeSet = () => {
    if ("vibrate" in navigator) navigator.vibrate(15);
    setPhase("rest");
  };

  return (
    <div className="min-h-dvh flex flex-col text-[var(--foreground)]">
      {/* Top bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          {todayWorkout.exercises.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: c.divider }}>
              <div
                className={cn(
                  "h-full transition-all",
                  i < exIdx ? "w-full" : i === exIdx ? "w-1/2" : "w-0",
                )}
                style={{ background: i <= exIdx ? c.sunGlare : "transparent", boxShadow: i === exIdx ? `0 0 6px ${c.sunGlareBg}` : "none" }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tabular" style={{ color: c.textTertiary }}>
            Exercise {exIdx + 1} of {todayWorkout.exercises.length}
          </span>
          <button
            onClick={() => setShowExitConfirm(true)}
            className="w-9 h-9 grid place-items-center rounded-xl transition-colors"
            style={{ color: c.textTertiary }}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            aria-label="Exit"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 pb-8">
        <AnimatePresence mode="wait">
          {phase === "warmup" && (
            <motion.div
              key="warmup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center text-center max-w-md mx-auto">
                <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: c.violet }}>Get ready</div>
                <h1 className="text-4xl font-black mb-2" style={{ color: c.textPrimary }}>{todayWorkout.title}</h1>
                <p className="font-medium mb-8" style={{ color: c.textSecondary }}>
                  {todayWorkout.duration} min · {todayWorkout.exercises.length} exercises
                </p>
                <div className="card-frosted p-5 text-left space-y-3 max-h-[40vh] overflow-y-auto">
                  {todayWorkout.exercises.map((e, i) => (
                    <div key={e.id} className="flex items-center gap-4 py-1.5">
                      <span
                        className="w-8 h-8 rounded-full grid place-items-center text-sm font-black tabular"
                        style={{ background: c.exuberantBg, color: c.exuberant }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-sm" style={{ color: c.textPrimary }}>{e.name}</div>
                        <div className="text-xs font-medium mt-0.5" style={{ color: c.textTertiary }}>
                          {e.sets} × {e.reps}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3 max-w-md mx-auto w-full">
                <button
                  onClick={() => setPhase("exercise")}
                  className="w-full h-[52px] rounded-full font-bold hover:opacity-90 active:scale-[0.98] transition-all"
                  style={{ background: c.sunGlare, color: "#1C1C1A", boxShadow: `0 0 28px ${c.sunGlareBg}` }}
                >
                  Start workout
                </button>
                <Link
                  to="/coach"
                  className="block text-center text-sm font-semibold hover:opacity-100 transition-opacity"
                  style={{ color: c.textTertiary }}
                >
                  Not today
                </Link>
              </div>
            </motion.div>
          )}

          {phase === "exercise" && !setComplete && (
            <motion.div
              key={`ex-${exIdx}-${setIdx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: c.violet }}>
                  Set {setIdx + 1} of {ex.sets}
                </div>
                <h2 className="text-5xl font-black mb-3" style={{ color: c.textPrimary }}>{ex.name}</h2>
                <div className="font-medium mb-8 tabular" style={{ color: c.textSecondary }}>
                  {ex.sets} sets × {ex.reps} reps
                </div>

                <ExerciseIllustration c={c} />

                <p className="italic text-sm max-w-xs mt-8 font-medium" style={{ color: c.textTertiary }}>{ex.tip}</p>
              </div>
              <div className="max-w-md mx-auto w-full space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setReps(Math.max(1, reps - 1))}
                    className="w-12 h-12 rounded-full grid place-items-center active:scale-90 transition-all"
                    style={{ border: `1.5px solid ${c.chipBorder}`, color: c.textSecondary }}
                    aria-label="Less reps"
                  >
                    <Minus size={18} strokeWidth={2.5} />
                  </button>
                  <div className="text-[40px] font-black tabular w-20 text-center tracking-tight" style={{ color: c.textPrimary }}>{reps}</div>
                  <button
                    onClick={() => setReps(reps + 1)}
                    className="w-12 h-12 rounded-full grid place-items-center active:scale-90 transition-all"
                    style={{ border: `1.5px solid ${c.chipBorder}`, color: c.textSecondary }}
                    aria-label="More reps"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>
                <button
                  onClick={completeSet}
                  className="w-full h-[52px] rounded-full font-bold hover:opacity-90 active:scale-[0.98] transition-all"
                  style={{ background: c.sunGlare, color: "#1C1C1A", boxShadow: `0 0 28px ${c.sunGlareBg}` }}
                >
                  Done — Start rest
                </button>
              </div>
            </motion.div>
          )}

          {phase === "exercise" && setComplete && (
            <motion.div
              key="setdone"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 grid place-items-center"
            >
              <div
                className="w-24 h-24 rounded-full shadow-xl grid place-items-center"
                style={{ background: c.exuberant, boxShadow: `0 0 40px ${c.exuberantBg}` }}
              >
                <Check size={48} strokeWidth={3.5} style={{ color: "#F2F0E9" }} />
              </div>
            </motion.div>
          )}

          {phase === "rest" && (
            <motion.div
              key="rest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-4"
            >
              <div className="text-xs uppercase tracking-widest font-bold mb-6" style={{ color: c.textTertiary }}>Rest</div>
              <RestRing seconds={restSec} total={ex.rest} c={c} />
              <div className="mt-8">
                <div className="text-xs uppercase tracking-wider font-bold mb-1" style={{ color: c.textTertiary }}>Next up</div>
                <div className="font-black text-[22px]" style={{ color: c.textPrimary }}>
                  {setIdx + 1 < ex.sets
                    ? `${ex.name} — set ${setIdx + 2}`
                    : todayWorkout.exercises[exIdx + 1]?.name || "Finish"}
                </div>
              </div>
              <p className="italic text-sm mt-8 font-medium max-w-xs" style={{ color: c.textSecondary }}>{motivationalCues[cueIdx]}</p>
              <button
                onClick={() => {
                  if (restTimer.current) window.clearInterval(restTimer.current);
                  advanceAfterRest();
                }}
                className="mt-8 text-sm font-bold hover:opacity-100 underline underline-offset-4"
                style={{ color: c.textTertiary }}
              >
                Skip rest
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 grid place-items-center px-5"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="card-frosted p-6 max-w-sm w-full"
              style={{ borderColor: c.divider }}
            >
              <h3 className="font-black text-lg mb-2" style={{ color: c.textPrimary }}>Exit workout?</h3>
              <p className="text-sm font-medium mb-5" style={{ color: c.textSecondary }}>Your progress so far won't be saved.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 h-12 rounded-full font-bold text-sm transition-all"
                  style={{ border: `1px solid ${c.chipBorder}`, color: c.textSecondary }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  Keep going
                </button>
                <Link
                  to="/coach"
                  className="flex-1 h-12 rounded-full font-bold text-sm grid place-items-center hover:opacity-90 transition-all"
                  style={{ background: c.exuberant, color: "#F2F0E9", boxShadow: `0 4px 16px ${c.exuberantBg}` }}
                >
                  Exit
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RestRing({ seconds, total, c }: { seconds: number; total: number; c: ReturnType<typeof useColors> }) {
  const r = 90,
    circ = 2 * Math.PI * r;
  const offset = circ - (seconds / total) * circ;
  return (
    <div className="relative w-[220px] h-[220px] grid place-items-center">
      <svg className="-rotate-90 absolute inset-0" viewBox="0 0 220 220">
        <circle cx={110} cy={110} r={r} stroke={c.divider} strokeWidth={8} fill="none" />
        <circle
          cx={110} cy={110} r={r}
          stroke={c.violet}
          strokeWidth={8} fill="none" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear", filter: `drop-shadow(0 0 8px ${c.violetBg})` }}
        />
      </svg>
      <div className="text-[64px] font-black tabular tracking-tighter" style={{ color: c.textPrimary }}>{seconds}</div>
    </div>
  );
}

function ExerciseIllustration({ c }: { c: ReturnType<typeof useColors> }) {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden>
      <circle cx="90" cy="90" r="84" fill={c.violetBg} opacity="0.3" stroke={c.violetBg} strokeWidth="1" />
      <circle cx="90" cy="55" r="14" fill={c.violetBg} opacity="0.8" />
      <rect x="76" y="70" width="28" height="40" rx="8" fill={c.violetBg} opacity="0.6" />
      <rect x="68" y="105" width="14" height="40" rx="6" fill={c.violetBg} opacity="0.5" transform="rotate(-8 75 125)" />
      <rect x="98" y="105" width="14" height="40" rx="6" fill={c.violetBg} opacity="0.5" transform="rotate(8 105 125)" />
      {/* Accent circles */}
      <circle cx="90" cy="55" r="6" fill={c.violet} opacity="0.8" />
    </svg>
  );
}
