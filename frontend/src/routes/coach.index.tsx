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
        <h1 className="font-display text-[clamp(28px,6vw,40px)] font-bold mb-5" style={{ color: "var(--foreground)" }}>Coach</h1>

        <AnimatePresence>
          {showCheckin && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="card-frosted p-5 mb-5 relative"
            >
              <button
                onClick={() => setCollapsed(true)}
                className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-3"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
              <h2 className="font-display text-[20px] font-semibold mb-1" style={{ color: "var(--color-text-dark)" }}>Daily check-in</h2>
              <p className="text-[13px] mb-5" style={{ color: "#3d6058" }}>
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
                className="w-full mt-5 h-12 rounded-full font-semibold text-[15px] hover:opacity-90 active:scale-[0.97] transition-all"
                style={Object.values(c).some((v) => v === 0) ? { background: "#e2ece7", color: "#6e9e96" } : { background: "#1a3d35", color: "#ffffff" }}
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
            <h2 className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>Today's workout</h2>
            <span className="text-[10px] font-bold bg-[rgba(244,124,60,0.15)] text-[#f47c3c] px-2 py-1 rounded-full uppercase tracking-wider">
              {todayWorkout.difficulty}
            </span>
          </div>

          {todayWorkout.adapted && (
            <div className="card-teal text-white border-none rounded-xl px-4 py-3 flex items-center gap-2 mb-3 text-[13px]">
              <Sparkles size={14} className="text-white/70" /> Plan adjusted based on your check-in
            </div>
          )}

          <div className="space-y-2">
            {todayWorkout.exercises.map((ex, i) => {
              const isDone = !!done[ex.id];
              const isOpen = expanded === ex.id;
              return (
                <div
                  key={ex.id}
                  className="card-frosted-light overflow-hidden transition-all"
                >
                  <div className="p-4 flex items-center gap-3">
                    <button
                      onClick={() => setDone({ ...done, [ex.id]: !isDone })}
                      className="w-[22px] h-[22px] rounded-lg grid place-items-center shrink-0 transition-all"
                      style={isDone
                        ? { background: "#1a3d35", color: "#ffffff" }
                        : { background: "#ffffff", border: "1.5px solid rgba(0,0,0,0.15)", color: "transparent" }}
                      aria-label="Mark done"
                    >
                      {isDone && <Check size={14} strokeWidth={3} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div
                        style={{ fontWeight: 600, fontSize: "14px", color: isDone ? "#8aada5" : "#0f2420", textDecoration: isDone ? "line-through" : "none" }}
                      >
                        {ex.name}
                      </div>
                      <div className="text-xs text-text-2">
                        <span style={{ fontSize: "12px", color: "#3d6058", fontWeight: 500 }}>{ex.sets} sets × {ex.reps} {ex.name === "Plank" ? "sec" : "reps"}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpanded(isOpen ? null : ex.id)}
                      className="w-8 h-8 grid place-items-center rounded-lg"
                      style={{ color: "#6e9e96" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f5f2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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
                         <div className="px-4 pb-4 pl-[52px] text-[13px]" style={{ color: "#3d6058" }}>
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
            <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "#e2ece7" }}>
              <motion.div
                style={{ height: "100%", background: "#1a3d35" }}
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
            className="mt-5 w-full h-12 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all"
            style={{ background: "#1a3d35", color: "#ffffff", borderRadius: "9999px", fontSize: "15px", fontWeight: 700 }}
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
        className="fixed bottom-[88px] lg:bottom-8 right-4 lg:right-8 z-30 h-14 px-6 rounded-full font-semibold text-[15px] flex items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all"
        style={{ background: "#1a3d35", color: "#ffffff", boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}
      >
        <MessageCircle size={16} /> Ask coach
      </Link>
    </AppShell>
  );
}
