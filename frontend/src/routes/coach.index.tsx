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
      { title: "Coach — MORF" },
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
  const allFilled = !Object.values(c).some((v) => v === 0);

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-4xl mx-auto pb-32">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#6B5FC3" }}>
            Today's session
          </p>
          <h1
            className="font-display font-black"
            style={{ fontSize: "clamp(28px,6vw,40px)", color: "#F2F0E9" }}
          >
            Coach
          </h1>
        </div>

        <AnimatePresence>
          {showCheckin && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="card-frosted p-5 mb-5 relative"
              style={{ borderColor: "rgba(214,232,0,0.12)" }}
            >
              <button
                onClick={() => setCollapsed(true)}
                className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-xl transition-colors"
                style={{ color: "rgba(242,240,233,0.4)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
              <h2
                className="font-black text-[20px] mb-1"
                style={{ color: "#F2F0E9" }}
              >
                Daily check-in
              </h2>
              <p className="text-[13px] mb-5 font-medium" style={{ color: "rgba(242,240,233,0.5)" }}>
                5 quick taps. Your plan adapts to your answers.
              </p>
              <div className="space-y-4">
                <CheckinDot label="Energy" icon={<Zap size={14} />} value={c.energy} onChange={(v) => setC({ ...c, energy: v })} />
                <CheckinDot label="Soreness" icon={<Dumbbell size={14} />} value={c.soreness} onChange={(v) => setC({ ...c, soreness: v })} />
                <CheckinDot label="Mood" icon={<Smile size={14} />} value={c.mood} onChange={(v) => setC({ ...c, mood: v })} />
                <CheckinDot label="Motivation" icon={<Target size={14} />} value={c.motivation} onChange={(v) => setC({ ...c, motivation: v })} />
                <CheckinDot label="Sleep" icon={<Moon size={14} />} value={c.sleep} onChange={(v) => setC({ ...c, sleep: v })} />
              </div>
              <button
                onClick={() => setCheckinDone(true)}
                disabled={!allFilled}
                className="w-full mt-5 h-12 rounded-full font-bold text-[15px] transition-all hover:opacity-90 active:scale-[0.97]"
                style={
                  allFilled
                    ? { background: "#6B5FC3", color: "#F2F0E9", boxShadow: "0 0 28px rgba(107,95,195,0.3)" }
                    : { background: "rgba(242,240,233,0.05)", color: "rgba(242,240,233,0.25)", cursor: "not-allowed" }
                }
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
            <h2 className="font-bold text-[17px]" style={{ color: "#F2F0E9" }}>Today's workout</h2>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
              style={{ background: "rgba(245,82,42,0.12)", color: "#F5522A", border: "1px solid rgba(245,82,42,0.2)" }}
            >
              {todayWorkout.difficulty}
            </span>
          </div>

          {todayWorkout.adapted && (
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-2 mb-3 text-[13px] font-medium"
              style={{
                background: "rgba(107,95,195,0.1)",
                border: "1px solid rgba(107,95,195,0.2)",
                color: "#8B80D4",
              }}
            >
              <Sparkles size={14} /> Plan adjusted based on your check-in
            </div>
          )}

          <div className="space-y-2">
            {todayWorkout.exercises.map((ex) => {
              const isDone = !!done[ex.id];
              const isOpen = expanded === ex.id;
              return (
                <div
                  key={ex.id}
                  className="card-frosted-light overflow-hidden transition-all"
                  style={isDone ? { borderColor: "rgba(214,232,0,0.15)" } : {}}
                >
                  <div className="p-4 flex items-center gap-3">
                    <button
                      onClick={() => setDone({ ...done, [ex.id]: !isDone })}
                      className="w-[22px] h-[22px] rounded-lg grid place-items-center shrink-0 transition-all"
                      style={
                        isDone
                          ? { background: "#F5522A", color: "#F2F0E9" }
                          : { background: "transparent", border: "1.5px solid rgba(242,240,233,0.2)", color: "transparent" }
                      }
                      aria-label="Mark done"
                    >
                      {isDone && <Check size={13} strokeWidth={3} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "14px",
                          color: isDone ? "rgba(242,240,233,0.3)" : "#F2F0E9",
                          textDecoration: isDone ? "line-through" : "none",
                        }}
                      >
                        {ex.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(242,240,233,0.45)", fontWeight: 500 }}>
                        {ex.sets} sets × {ex.reps} {ex.name === "Plank" ? "sec" : "reps"}
                      </div>
                    </div>
                    <button
                      onClick={() => setExpanded(isOpen ? null : ex.id)}
                      className="w-8 h-8 grid place-items-center rounded-lg transition-colors"
                      style={{ color: "rgba(242,240,233,0.35)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.06)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      aria-label="Details"
                    >
                      <ChevronDown
                        size={15}
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
                        <div
                          className="px-4 pb-4 pl-[52px] text-[13px] space-y-1"
                          style={{ color: "rgba(242,240,233,0.5)" }}
                        >
                          <p className="italic">{ex.tip}</p>
                          <p>{ex.instructions}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <div
              className="flex-1 h-[3px] rounded-full overflow-hidden"
              style={{ background: "rgba(242,240,233,0.07)" }}
            >
              <motion.div
                style={{ height: "100%", background: "#F5522A", borderRadius: "9999px", boxShadow: "0 0 8px rgba(245,82,42,0.4)" }}
                animate={{ width: `${(completed / todayWorkout.exercises.length) * 100}%` }}
              />
            </div>
            <span className="text-xs tabular font-semibold" style={{ color: "rgba(242,240,233,0.45)" }}>
              {completed}/{todayWorkout.exercises.length}
            </span>
          </div>

          <Link
            to="/coach/workout/$sessionId"
            params={{ sessionId: todayWorkout.id }}
            className="mt-5 w-full h-12 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all font-bold"
            style={{
              background: "#D6E800",
              color: "#1C1C1A",
              borderRadius: "9999px",
              fontSize: "15px",
              boxShadow: "0 0 28px rgba(214,232,0,0.2)",
            }}
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
        className="fixed bottom-[88px] lg:bottom-8 right-4 lg:right-8 z-30 h-14 px-6 rounded-full font-bold text-[15px] flex items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all"
        style={{
          background: "#F5522A",
          color: "#F2F0E9",
          boxShadow: "0 4px 24px rgba(245,82,42,0.35)",
        }}
      >
        <MessageCircle size={16} /> Ask coach
      </Link>
    </AppShell>
  );
}
