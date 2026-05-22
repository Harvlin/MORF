import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CalendarDays, LayoutGrid, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export type CalendarDay = {
  date: string;
  status: "done" | "skipped" | "rest" | "planned" | "empty" | "today";
  workout?: {
    title: string;
    duration: number;
    intensity: "low" | "medium" | "high";
    sessionId: string;
  };
};

export type WorkoutCalendarProps = {
  data: CalendarDay[];
  defaultMode?: "week" | "month";
  currentDate: Date;
  onDaySelect?: (day: CalendarDay) => void;
};

const DOW_ID = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];
const DOW_EN = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}
function parseISO(s: string) {
  return new Date(s + "T00:00:00");
}

function generateMonth(currentDate: Date, weekData: CalendarDay[]): CalendarDay[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days: CalendarDay[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  const weekMap = new Map(weekData.map((d) => [d.date, d]));
  const today = iso(new Date());
  for (let i = 1; i <= lastDay; i++) {
    const date = iso(new Date(year, month, i));
    const existing = weekMap.get(date);
    if (existing) {
      days.push(existing);
      continue;
    }
    if (date === today) {
      days.push({
        date,
        status: "today",
        workout: { title: "Lower Body", duration: 35, intensity: "medium", sessionId: "w_today" },
      });
    } else {
      const dayOfWeek = new Date(year, month, i).getDay();
      const past = date < today;
      if (past) {
        // mix of done/skipped/rest
        const r = (i * 7) % 5;
        if (r === 0) days.push({ date, status: "rest" });
        else if (r === 1) days.push({ date, status: "skipped" });
        else
          days.push({
            date,
            status: "done",
            workout: { title: "Session", duration: 30, intensity: "medium", sessionId: "w_" + i },
          });
      } else {
        if (dayOfWeek === 0 || dayOfWeek === 3) days.push({ date, status: "rest" });
        else
          days.push({
            date,
            status: "planned",
            workout: {
              title: "Upper Body",
              duration: 30,
              intensity: "medium",
              sessionId: "w_" + i,
            },
          });
      }
    }
  }
  return days;
}

export function WorkoutCalendar({
  data,
  defaultMode = "week",
  currentDate,
  onDaySelect,
}: WorkoutCalendarProps) {
  const [mode, setMode] = useState<"week" | "month">(defaultMode);
  const [viewDate, setViewDate] = useState(currentDate);
  const [selected, setSelected] = useState<CalendarDay | null>(null);

  const handleSelect = (d: CalendarDay) => {
    if (d.status === "empty") return;
    setSelected(d);
    onDaySelect?.(d);
  };

  return (
    <div className="card-frosted p-5" style={{ borderColor: "rgba(242,240,233,0.07)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const d = new Date(viewDate);
              if (mode === "week") d.setDate(d.getDate() - 7);
              else d.setMonth(d.getMonth() - 1);
              setViewDate(d);
            }}
            className="w-7 h-7 rounded-md grid place-items-center transition-colors"
            style={{ color: "rgba(242,240,233,0.45)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.07)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm font-semibold px-1.5 min-w-[100px] text-center" style={{ color: "#F2F0E9" }}>
            {mode === "week"
              ? "This week"
              : viewDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <button
            onClick={() => {
              const d = new Date(viewDate);
              if (mode === "week") d.setDate(d.getDate() + 7);
              else d.setMonth(d.getMonth() + 1);
              setViewDate(d);
            }}
            className="w-7 h-7 rounded-md grid place-items-center transition-colors"
            style={{ color: "rgba(242,240,233,0.45)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.07)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <button
          onClick={() => setMode(mode === "week" ? "month" : "week")}
          className="text-xs flex items-center gap-1.5 px-2.5 h-7 rounded-md transition-colors"
          style={{ color: "rgba(242,240,233,0.4)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(242,240,233,0.06)"; e.currentTarget.style.color = "#F2F0E9"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(242,240,233,0.4)"; }}
        >
          {mode === "week" ? (
            <>
              <CalendarDays size={13} /> Month view
            </>
          ) : (
            <>
              <LayoutGrid size={13} /> Week view
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          {mode === "week" ? (
            <WeekView data={data} onSelect={handleSelect} selected={selected} />
          ) : (
            <MonthView
              viewDate={viewDate}
              weekData={data}
              onSelect={handleSelect}
              selected={selected}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {selected && <DayPopover day={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function WeekView({
  data,
  onSelect,
  selected,
}: {
  data: CalendarDay[];
  onSelect: (d: CalendarDay) => void;
  selected: CalendarDay | null;
}) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {data.map((d, i) => {
        const date = parseISO(d.date);
        const isToday = d.status === "today";
        const isSelected = selected?.date === d.date;
        return (
          <button
            key={d.date}
            onClick={() => onSelect(d)}
            className="flex flex-col items-center gap-1.5 group"
          >
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(242,240,233,0.35)" }}>
              {DOW_EN[(date.getDay() + 6) % 7]}
            </span>
            <span
              className="w-full aspect-square rounded-xl flex items-center justify-center text-xs font-medium font-mono relative transition-all"
              style={{
                background: d.status === "done"
                  ? "rgba(214,232,0,0.15)"
                  : isToday
                    ? "#D6E800"
                    : d.status === "planned"
                      ? "rgba(242,240,233,0.06)"
                      : d.status === "rest"
                        ? "rgba(242,240,233,0.03)"
                        : d.status === "skipped"
                          ? "rgba(245,82,42,0.08)"
                          : "transparent",
                color: d.status === "done"
                  ? "#D6E800"
                  : isToday
                    ? "#1C1C1A"
                    : d.status === "planned"
                      ? "rgba(242,240,233,0.55)"
                      : d.status === "rest"
                        ? "rgba(242,240,233,0.25)"
                        : d.status === "skipped"
                          ? "rgba(245,82,42,0.7)"
                          : "rgba(242,240,233,0.3)",
                border: isSelected && !isToday ? "2px solid rgba(214,232,0,0.5)" :
                  d.status === "rest" ? "1px dashed rgba(242,240,233,0.1)" :
                  d.status === "skipped" ? "1px dashed rgba(245,82,42,0.2)" : "none",
                fontWeight: isToday ? 900 : 500,
              }}
            >
              {d.status === "done" && <Check size={14} strokeWidth={3} />}
              {isToday && "•"}
              {d.status === "planned" && date.getDate()}
              {d.status === "rest" && "R"}
              {d.status === "skipped" && "×"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MonthView({
  viewDate,
  weekData,
  onSelect,
  selected,
}: {
  viewDate: Date;
  weekData: CalendarDay[];
  onSelect: (d: CalendarDay) => void;
  selected: CalendarDay | null;
}) {
  const days = generateMonth(viewDate, weekData);
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const padStart = (first.getDay() + 6) % 7; // Mon = 0
  const cells: Array<CalendarDay | null> = [...Array(padStart).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);

  const stats = days.reduce(
    (acc, d) => {
      if (d.status === "done") acc.done++;
      else if (d.status === "skipped") acc.skipped++;
      else if (d.status === "rest") acc.rest++;
      return acc;
    },
    { done: 0, skipped: 0, rest: 0 },
  );

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DOW_ID.map((d) => (
          <div
            key={d}
            className="text-[10px] uppercase tracking-wider text-center font-semibold"
            style={{ color: "rgba(242,240,233,0.3)" }}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={"e" + i} className="aspect-square" />;
          const isToday = d.status === "today";
          const isSelected = selected?.date === d.date;
          const dateNum = parseISO(d.date).getDate();
          return (
            <button
              key={d.date}
              onClick={() => onSelect(d)}
              className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-all relative"
              style={{
                background: isToday
                  ? "rgba(214,232,0,0.12)"
                  : d.status === "done"
                    ? "rgba(214,232,0,0.06)"
                    : "transparent",
                border: isSelected
                  ? "2px solid rgba(214,232,0,0.5)"
                  : isToday
                    ? "1px solid rgba(214,232,0,0.25)"
                    : "none",
              }}
              onMouseEnter={e => { if (!isToday && !isSelected) e.currentTarget.style.background = "rgba(242,240,233,0.04)"; }}
              onMouseLeave={e => { if (!isToday && !isSelected) e.currentTarget.style.background = d.status === "done" ? "rgba(214,232,0,0.06)" : "transparent"; }}
            >
              <span
                className="text-xs font-medium tabular-nums"
                style={{
                  color: isToday
                    ? "#D6E800"
                    : d.status === "done"
                      ? "rgba(242,240,233,0.75)"
                      : d.status === "skipped"
                        ? "rgba(245,82,42,0.5)"
                        : d.status === "rest"
                          ? "rgba(242,240,233,0.25)"
                          : "rgba(242,240,233,0.5)",
                  textDecoration: d.status === "skipped" ? "line-through" : "none",
                  fontWeight: isToday ? 700 : 500,
                }}
              >
                {dateNum}
              </span>
              {d.status === "done" && <span className="w-1 h-1 rounded-full" style={{ background: "#D6E800" }} />}
              {isToday && <span className="w-1 h-1 rounded-full" style={{ background: "#D6E800" }} />}
              {d.status === "skipped" && <span className="w-1 h-1 rounded-full" style={{ background: "rgba(245,82,42,0.5)" }} />}
              {d.status === "planned" && <span className="w-1 h-1 rounded-full" style={{ background: "rgba(242,240,233,0.15)" }} />}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 px-1 pt-3 mt-3" style={{ borderTop: "1px solid rgba(242,240,233,0.07)" }}>
        <Stat color="#D6E800" label={`${stats.done} done`} />
        <Stat color="rgba(245,82,42,0.6)" label={`${stats.skipped} skipped`} />
        <Stat color="rgba(242,240,233,0.2)" label={`${stats.rest} rest days`} />
      </div>
    </div>
  );
}

function Stat({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(242,240,233,0.4)" }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}

function DayPopover({ day, onClose }: { day: CalendarDay; onClose: () => void }) {
  const d = parseISO(day.date);
  const label = d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" });
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-4 card-frosted p-4 shadow-xl relative"
      style={{ borderColor: "rgba(242,240,233,0.1)" }}
    >
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 w-7 h-7 grid place-items-center rounded-lg transition-colors"
        style={{ color: "rgba(242,240,233,0.35)" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.07)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <X size={13} />
      </button>
      <div className="text-xs font-semibold pr-6" style={{ color: "rgba(242,240,233,0.45)" }}>{label}</div>
      <div className="mt-2.5">
        {day.status === "today" && day.workout && (
          <>
            <div className="text-sm font-semibold" style={{ color: "#F2F0E9" }}>
              {day.workout.title} · {day.workout.duration} min
            </div>
            <Link
              to="/coach/workout/$sessionId"
              params={{ sessionId: day.workout.sessionId }}
              className="inline-flex items-center mt-3 h-9 px-4 rounded-lg text-xs font-bold hover:opacity-90 active:scale-[0.97] transition-all"
              style={{ background: "#D6E800", color: "#1C1C1A" }}
            >
              Start workout →
            </Link>
          </>
        )}
        {day.status === "done" && (
          <>
            <span
              className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ background: "rgba(214,232,0,0.1)", color: "#D6E800", border: "1px solid rgba(214,232,0,0.2)" }}
            >
              ✓ Completed
            </span>
            <div className="text-sm font-semibold mt-2" style={{ color: "#F2F0E9" }}>
              {day.workout?.title ?? "Session"} · {day.workout?.duration ?? 30} min
            </div>
            <button className="text-xs font-bold hover:underline mt-3" style={{ color: "#D6E800" }}>View details →</button>
          </>
        )}
        {day.status === "planned" && (
          <>
            <div className="text-sm font-semibold" style={{ color: "#F2F0E9" }}>{day.workout?.title ?? "Workout"}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(242,240,233,0.45)" }}>
              {day.workout?.duration ?? 30} min · planned
            </div>
            <button className="text-xs font-bold hover:underline mt-3" style={{ color: "rgba(242,240,233,0.5)" }}>Edit plan</button>
          </>
        )}
        {day.status === "rest" && (
          <>
            <span
              className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ background: "rgba(107,95,195,0.12)", color: "#8B80D4", border: "1px solid rgba(107,95,195,0.2)" }}
            >
              Rest day
            </span>
            <div className="text-xs mt-2" style={{ color: "rgba(242,240,233,0.4)" }}>
              Recovery matters as much as the work. Hydrate & sleep well.
            </div>
          </>
        )}
        {day.status === "skipped" && (
          <>
            <span
              className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ background: "rgba(245,82,42,0.1)", color: "#F5522A", border: "1px solid rgba(245,82,42,0.2)" }}
            >
              Skipped
            </span>
            <button className="block text-xs font-bold hover:underline mt-3" style={{ color: "rgba(242,240,233,0.45)" }}>Log reason</button>
          </>
        )}
      </div>
    </motion.div>
  );
}
