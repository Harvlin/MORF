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
    <div className="card-frosted p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const d = new Date(viewDate);
              if (mode === "week") d.setDate(d.getDate() - 7);
              else d.setMonth(d.getMonth() - 1);
              setViewDate(d);
            }}
            className="w-7 h-7 rounded-md grid place-items-center hover:bg-surface-3 text-text-2"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm font-semibold text-text-1 px-1.5 min-w-[100px] text-center">
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
            className="w-7 h-7 rounded-md grid place-items-center hover:bg-surface-3 text-text-2"
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <button
          onClick={() => setMode(mode === "week" ? "month" : "week")}
          className="text-xs text-text-2 hover:text-text-1 flex items-center gap-1.5 px-2.5 h-7 rounded-md hover:bg-surface-3 transition-colors"
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
            <span className="text-[10px] text-text-3 uppercase tracking-wider font-medium">
              {DOW_EN[(date.getDay() + 6) % 7]}
            </span>
            <span
              className={cn(
                "w-full aspect-square rounded-xl flex items-center justify-center text-xs font-medium font-mono relative transition-all",
                d.status === "done" && "bg-accent text-white shadow-sm",
                isToday &&
                  "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                d.status === "planned" &&
                  "bg-surface-2 text-text-2 border border-border group-hover:border-border-strong",
                d.status === "rest" &&
                  "bg-surface-2/60 text-text-3 border border-dashed border-border",
                d.status === "skipped" &&
                  "bg-surface-3 text-text-3 border border-dashed border-border",
                isSelected && !isToday && "ring-2 ring-primary/40",
              )}
            >
              {d.status === "done" && <Check size={14} strokeWidth={3} />}
              {isToday && "•"}
              {d.status === "planned" && date.getDate()}
              {d.status === "rest" && "S"}
              {d.status === "skipped" && "z"}
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
            className="text-[10px] text-text-3 uppercase tracking-wider text-center font-medium"
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
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-colors hover:bg-surface-3 relative",
                isToday && "bg-primary-light ring-1 ring-primary/40",
                d.status === "done" && "bg-[rgba(244,124,60,0.15)]",
                isSelected && "ring-2 ring-primary/60",
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium tabular-nums",
                  d.status === "done" && "text-text-1",
                  isToday && "text-primary font-semibold",
                  d.status === "skipped" && "text-text-3 line-through",
                  d.status === "rest" && "text-text-3",
                  d.status === "planned" && "text-text-2",
                )}
              >
                {dateNum}
              </span>
              {d.status === "done" && <span className="w-1.5 h-1.5 rounded-full bg-[#f47c3c]" />}
              {isToday && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              {d.status === "skipped" && (
                <span className="w-1.5 h-1.5 rounded-full bg-surface-3 border border-border" />
              )}
              {d.status === "planned" && <span className="w-1.5 h-1.5 rounded-full bg-border" />}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 px-1 pt-3 border-t border-border mt-3">
        <Stat color="bg-[#f47c3c]" label={`${stats.done} done`} />
        <Stat color="bg-surface-3" label={`${stats.skipped} skipped`} />
        <Stat color="bg-border" label={`${stats.rest} rest days`} />
      </div>
    </div>
  );
}

function Stat({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-text-2">
      <span className={cn("w-1.5 h-1.5 rounded-full", color)} />
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
    >
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 w-7 h-7 grid place-items-center rounded-md hover:bg-surface-3 text-text-3"
      >
        <X size={13} />
      </button>
      <div className="text-xs text-text-2 font-medium pr-6">{label}</div>
      <div className="mt-2.5">
        {day.status === "today" && day.workout && (
          <>
            <div className="text-sm font-medium text-text-1">
              {day.workout.title} · {day.workout.duration} min
            </div>
            <Link
              to="/coach/workout/$sessionId"
              params={{ sessionId: day.workout.sessionId }}
              className="inline-flex items-center mt-3 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 active:scale-[0.97] transition-all"
            >
              Start workout →
            </Link>
          </>
        )}
        {day.status === "done" && (
          <>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(244,124,60,0.15)] text-[#f47c3c] uppercase tracking-wider">
              ✓ Completed
            </span>
            <div className="text-sm font-medium text-text-1 mt-2">
              {day.workout?.title ?? "Session"} · {day.workout?.duration ?? 30} min
            </div>
            <button className="text-xs text-primary hover:underline mt-3">View details →</button>
          </>
        )}
        {day.status === "planned" && (
          <>
            <div className="text-sm font-medium text-text-1">{day.workout?.title ?? "Workout"}</div>
            <div className="text-xs text-text-2 mt-0.5">
              {day.workout?.duration ?? 30} min · planned
            </div>
            <button className="text-xs text-primary hover:underline mt-3">Edit plan</button>
          </>
        )}
        {day.status === "rest" && (
          <>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(244,124,60,0.15)] text-[#f47c3c] uppercase tracking-wider">
              Rest day
            </span>
            <div className="text-xs text-text-2 mt-2">
              Recovery matters as much as the work. Hydrate & sleep well.
            </div>
          </>
        )}
        {day.status === "skipped" && (
          <>
            <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-3 text-text-2 uppercase tracking-wider">
              Skipped
            </span>
            <button className="block text-xs text-primary hover:underline mt-3">Log reason</button>
          </>
        )}
      </div>
    </motion.div>
  );
}
