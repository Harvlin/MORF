import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Check } from "lucide-react";
import { todayWorkout, motivationalCues } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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
            <div key={i} className="flex-1 h-1 bg-[rgba(255,255,255,0.4)] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full bg-[#1a3d35] transition-all",
                  i < exIdx ? "w-full" : i === exIdx ? "w-1/2" : "w-0",
                )}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--foreground)] opacity-70 font-semibold tabular">
            Exercise {exIdx + 1} of {todayWorkout.exercises.length}
          </span>
          <button
            onClick={() => setShowExitConfirm(true)}
            className="w-9 h-9 grid place-items-center rounded-lg hover:bg-[rgba(255,255,255,0.4)] text-[var(--foreground)] opacity-70 hover:opacity-100"
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
                <div className="text-xs uppercase tracking-widest text-[#1a3d35] opacity-70 font-bold mb-3">Get ready</div>
                <h1 className="text-4xl font-bold mb-2">{todayWorkout.title}</h1>
                <p className="text-[var(--foreground)] opacity-80 font-medium mb-8">
                  {todayWorkout.duration} min · {todayWorkout.exercises.length} exercises
                </p>
                <div className="card-frosted p-5 text-left space-y-3 max-h-[40vh] overflow-y-auto">
                  {todayWorkout.exercises.map((e, i) => (
                    <div key={e.id} className="flex items-center gap-4 py-1.5">
                      <span className="w-8 h-8 rounded-full bg-[rgba(26,61,53,0.15)] grid place-items-center text-sm font-bold tabular text-[#1a3d35]">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-[var(--foreground)]">{e.name}</div>
                        <div className="text-xs text-[var(--foreground)] opacity-70 font-medium mt-0.5">
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
                  className="w-full h-[52px] rounded-full bg-[#1a3d35] text-white font-bold hover:opacity-90 active:scale-[0.98] shadow-lg transition-all"
                >
                  Start workout
                </button>
                <Link
                  to="/coach"
                  className="block text-center text-sm font-semibold text-[var(--foreground)] opacity-60 hover:opacity-100"
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
                <div className="text-xs uppercase tracking-widest text-[#1a3d35] font-bold mb-3">
                  Set {setIdx + 1} of {ex.sets}
                </div>
                <h2 className="text-5xl font-bold mb-3">{ex.name}</h2>
                <div className="text-[var(--foreground)] opacity-70 font-medium mb-8 tabular">
                  {ex.sets} sets × {ex.reps} reps
                </div>

                <ExerciseIllustration />

                <p className="italic text-sm text-[var(--foreground)] opacity-80 max-w-xs mt-8 font-medium">{ex.tip}</p>
              </div>
              <div className="max-w-md mx-auto w-full space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setReps(Math.max(1, reps - 1))}
                    className="w-12 h-12 rounded-full border border-[rgba(26,61,53,0.2)] grid place-items-center hover:bg-[rgba(255,255,255,0.4)] text-[#1a3d35] active:scale-90 transition-all"
                    aria-label="Less reps"
                  >
                    <Minus size={18} strokeWidth={2.5} />
                  </button>
                  <div className="text-[40px] font-bold tabular w-20 text-center tracking-tight">{reps}</div>
                  <button
                    onClick={() => setReps(reps + 1)}
                    className="w-12 h-12 rounded-full border border-[rgba(26,61,53,0.2)] grid place-items-center hover:bg-[rgba(255,255,255,0.4)] text-[#1a3d35] active:scale-90 transition-all"
                    aria-label="More reps"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>
                <button
                  onClick={completeSet}
                  className="w-full h-[52px] rounded-full bg-[#1a3d35] text-white font-bold hover:opacity-90 active:scale-[0.98] shadow-lg transition-all"
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
              <div className="w-24 h-24 rounded-full bg-[#f47c3c] text-white shadow-xl grid place-items-center">
                <Check size={48} strokeWidth={3.5} />
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
              <div className="text-xs uppercase tracking-widest text-[var(--foreground)] opacity-60 font-bold mb-6">Rest</div>
              <RestRing seconds={restSec} total={ex.rest} />
              <div className="mt-8">
                <div className="text-xs text-[var(--foreground)] opacity-70 uppercase tracking-wider font-bold mb-1">Next up</div>
                <div className="font-bold text-[22px]">
                  {setIdx + 1 < ex.sets
                    ? `${ex.name} — set ${setIdx + 2}`
                    : todayWorkout.exercises[exIdx + 1]?.name || "Finish"}
                </div>
              </div>
              <p className="italic text-sm text-[var(--foreground)] opacity-80 mt-8 font-medium max-w-xs">{motivationalCues[cueIdx]}</p>
              <button
                onClick={() => {
                  if (restTimer.current) window.clearInterval(restTimer.current);
                  advanceAfterRest();
                }}
                className="mt-8 text-sm font-semibold text-[var(--foreground)] opacity-60 hover:opacity-100 underline underline-offset-4"
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
            className="fixed inset-0 bg-black/50 z-50 grid place-items-center px-5"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="card-frosted p-6 max-w-sm w-full text-[var(--foreground)]"
            >
              <h3 className="font-bold text-lg mb-2">Exit workout?</h3>
              <p className="text-sm opacity-80 mb-5 font-medium">Your progress so far won't be saved.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 h-12 rounded-full border border-[rgba(26,61,53,0.3)] font-bold text-sm hover:bg-[rgba(255,255,255,0.4)] transition-all"
                >
                  Keep going
                </button>
                <Link
                  to="/coach"
                  className="flex-1 h-12 rounded-full bg-[#ef4444] text-white font-bold text-sm grid place-items-center shadow-md hover:opacity-90 transition-all"
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

function RestRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 90,
    c = 2 * Math.PI * r;
  const offset = c - (seconds / total) * c;
  return (
    <div className="relative w-[220px] h-[220px] grid place-items-center">
      <svg className="-rotate-90 absolute inset-0" viewBox="0 0 220 220">
        <circle
          cx={110}
          cy={110}
          r={r}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={8}
          fill="none"
        />
        <circle
          cx={110}
          cy={110}
          r={r}
          stroke="#f47c3c"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="text-[64px] font-extrabold tabular tracking-tighter text-[#1a3d35]">{seconds}</div>
    </div>
  );
}

function ExerciseIllustration() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden>
      <circle cx="90" cy="90" r="84" fill="rgba(255,255,255,0.45)" />
      <circle cx="90" cy="55" r="14" fill="#1a3d35" />
      <rect x="76" y="70" width="28" height="40" rx="8" fill="#1a3d35" />
      <rect
        x="68"
        y="105"
        width="14"
        height="40"
        rx="6"
        fill="#1a3d35"
        transform="rotate(-8 75 125)"
      />
      <rect
        x="98"
        y="105"
        width="14"
        height="40"
        rx="6"
        fill="#1a3d35"
        transform="rotate(8 105 125)"
      />
    </svg>
  );
}
