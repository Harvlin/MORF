import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  MessageCircle,
  ChevronDown,
  Check,
  Play,
  Zap,
  Dumbbell,
  Smile,
  Target,
  Moon,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CheckinDot } from "@/components/CheckinDot";
import { todayWorkout, weekOverview } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { WorkoutCalendar, type CalendarDay } from "@/components/WorkoutCalendar";
import { HealthConsiderationsPanel } from "@/components/HealthConsiderationsPanel";

const calendarData: CalendarDay[] = weekOverview.map((d) => ({
  date: d.date,
  status:
    d.status === "completed"
      ? "done"
      : d.status === "today"
        ? "today"
        : (d.status as CalendarDay["status"]),
  workout:
    d.status !== "rest" && d.status !== "skipped"
      ? { title: "Lower Body", duration: 35, intensity: "medium", sessionId: "w_today" }
      : undefined,
}));

export const Route = createFileRoute("/coach/")({
  head: () => ({
    meta: [
      { title: "Coach — Athena" },
      { name: "description", content: "Adaptive workout plan and daily check-in." },
    ],
  }),
  component: CoachPage,
});

function CoachPage() {
  const checkinDone = useApp((s) => s.checkinDoneToday);
  const setCheckinDone = useApp((s) => s.setCheckinDone);
  const [c, setC] = useState({ energy: 0, soreness: 0, mood: 0, motivation: 0, sleep: 0 });
  const [collapsed, setCollapsed] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const completed = Object.values(done).filter(Boolean).length;
  const showCheckin = !checkinDone && !collapsed;

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-4xl mx-auto pb-32">
        <h1 className="text-3xl lg:text-4xl font-semibold mb-5">Coach</h1>

        <AnimatePresence>
          {showCheckin && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-surface border border-border rounded-2xl p-5 mb-5 relative"
            >
              <button
                onClick={() => setCollapsed(true)}
                className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-3"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
              <h2 className="font-semibold text-lg mb-1">Daily check-in</h2>
              <p className="text-sm text-text-2 mb-5">
                5 quick taps. Your plan adapts to your answers.
              </p>
              <div className="space-y-4">
                <CheckinDot
                  label="Energy"
                  icon={<Zap size={14} />}
                  value={c.energy}
                  onChange={(v) => setC({ ...c, energy: v })}
                />
                <CheckinDot
                  label="Soreness"
                  icon={<Dumbbell size={14} />}
                  value={c.soreness}
                  onChange={(v) => setC({ ...c, soreness: v })}
                />
                <CheckinDot
                  label="Mood"
                  icon={<Smile size={14} />}
                  value={c.mood}
                  onChange={(v) => setC({ ...c, mood: v })}
                />
                <CheckinDot
                  label="Motivation"
                  icon={<Target size={14} />}
                  value={c.motivation}
                  onChange={(v) => setC({ ...c, motivation: v })}
                />
                <CheckinDot
                  label="Sleep"
                  icon={<Moon size={14} />}
                  value={c.sleep}
                  onChange={(v) => setC({ ...c, sleep: v })}
                />
              </div>
              <button
                onClick={() => setCheckinDone(true)}
                disabled={Object.values(c).some((v) => v === 0)}
                className="w-full mt-5 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:bg-surface-3 disabled:text-text-3 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Submit check-in
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <HealthConsiderationsPanel />

        {/* Today's plan */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Today's workout</h2>
            <span className="text-[10px] font-semibold bg-secondary-light text-secondary px-2 py-1 rounded-full uppercase tracking-wider">
              {todayWorkout.difficulty}
            </span>
          </div>

          {todayWorkout.adapted && (
            <div className="bg-primary-light border border-primary/20 rounded-xl px-4 py-2.5 flex items-center gap-2 mb-3 text-sm">
              <Sparkles size={14} className="text-primary" /> Plan adjusted based on your check-in
            </div>
          )}

          <div className="space-y-2">
            {todayWorkout.exercises.map((ex, i) => {
              const isDone = !!done[ex.id];
              const isOpen = expanded === ex.id;
              return (
                <div
                  key={ex.id}
                  className={cn(
                    "bg-surface border rounded-2xl overflow-hidden transition-all",
                    isDone ? "border-secondary/40 bg-secondary-light/40" : "border-border",
                  )}
                >
                  <div className="p-4 flex items-center gap-3">
                    <button
                      onClick={() => setDone({ ...done, [ex.id]: !isDone })}
                      className={cn(
                        "w-6 h-6 rounded-md border-2 grid place-items-center shrink-0 transition-all active:scale-90",
                        isDone
                          ? "bg-secondary border-secondary text-secondary-foreground"
                          : "border-text-3",
                      )}
                      aria-label="Mark done"
                    >
                      {isDone && <Check size={14} strokeWidth={3} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "font-semibold text-sm",
                          isDone && "line-through text-text-2",
                        )}
                      >
                        {ex.name}
                      </div>
                      <div className="text-xs text-text-2">
                        {ex.sets} sets × {ex.reps} {ex.name === "Plank" ? "sec" : "reps"}
                      </div>
                    </div>
                    <button
                      onClick={() => setExpanded(isOpen ? null : ex.id)}
                      className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-3"
                      aria-label="Details"
                    >
                      <ChevronDown
                        size={16}
                        className={cn("transition-transform", isOpen && "rotate-180")}
                      />
                    </button>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pl-13 text-sm text-text-2">
                          <p className="italic mb-2">{ex.tip}</p>
                          <p>{ex.instructions}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-surface-3 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${(completed / todayWorkout.exercises.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-2 tabular">
              {completed}/{todayWorkout.exercises.length}
            </span>
          </div>

          <Link
            to="/coach/workout/$sessionId"
            params={{ sessionId: todayWorkout.id }}
            className="mt-5 w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Play size={16} fill="currentColor" /> Enter focus mode
          </Link>
        </div>

        <section className="mb-5">
          <WorkoutCalendar
            data={calendarData}
            defaultMode="week"
            currentDate={new Date("2025-05-15")}
          />
        </section>
      </div>

      <Link
        to="/coach/chat"
        className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-30 bg-primary text-primary-foreground h-12 px-5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-[var(--shadow-lift)] hover:opacity-90 active:scale-95 transition-all"
      >
        <MessageCircle size={16} /> Ask coach
      </Link>
    </AppShell>
  );
}
