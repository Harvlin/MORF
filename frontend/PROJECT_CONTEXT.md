# MORF Frontend Context (May 19, 2026)

## 1. Codebase / file structure

Frontend tree (selected):

```
frontend/
  src/
    components/
      layout/
      ui/
    hooks/
    lib/
    routes/
    router.tsx
    routeTree.gen.ts
    server.ts
    start.ts
    styles.css
  package.json
  tsconfig.json
  vite.config.ts
  components.json
```

Requested files (full contents below):
- src/routes/__root.tsx
- src/routes/dashboard.tsx
- src/routes/coach.index.tsx
- src/routes/community.index.tsx
- src/routes/profile.index.tsx
- src/routes/onboarding.tsx
- Styling config: src/styles.css
- tailwind.config.*: not found in repo (Tailwind v4 appears configured via CSS @import in styles.css)

---

### src/routes/__root.tsx

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { useApp } from "@/lib/store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MORF — Inclusive sports for everyone" },
      {
        name: "description",
        content:
          "AI-powered inclusive sports platform for beginners, women, and people with accessibility needs.",
      },
      { name: "author", content: "MORF" },
      { property: "og:title", content: "MORF — Inclusive sports for everyone" },
      {
        property: "og:description",
        content: "Sports for every body. Adaptive coaching, real community.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="app-loading" className="app-loading" role="status" aria-live="polite">
          <div className="app-loading__content">
            <div className="app-loading__label">Loading MORF</div>
            <div className="app-loading__bar">
              <span />
            </div>
          </div>
        </div>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);

  useEffect(() => {
    setTheme(theme);
  }, []); // eslint-disable-line

  useEffect(() => {
    const el = document.getElementById("app-loading");
    if (!el) return;
    el.classList.add("app-loading--hide");
    const timeout = window.setTimeout(() => el.remove(), 900);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
```

### src/routes/dashboard.tsx

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Award, Activity, Play, ChevronRight, MessageCircle, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { NudgeBanner } from "@/components/NudgeBanner";
import { EventCard } from "@/components/EventCard";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { currentUser, todayWorkout, events, chatHistory, analyses } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Home — MORF" },
      { name: "description", content: "Your daily MORF hub: today's plan, check-in, events." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const checkinDone = useApp((s) => s.checkinDoneToday);
  const lastChat = chatHistory[chatHistory.length - 1];
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const lastScore = analyses[0].score;

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">
              {greet}, {currentUser.name}
            </h1>
            <p className="text-text-2 text-sm mt-1">Thursday, May 15</p>
          </div>
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          <div className="space-y-5">
            <NudgeBanner />

            {/* Check-in status */}
            {!checkinDone && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary-light text-primary grid place-items-center text-xl">
                  <Zap size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">How are you feeling today?</div>
                  <div className="text-xs text-text-2">Quick check-in helps tune your plan</div>
                </div>
                <Link
                  to="/coach"
                  className="bg-primary text-primary-foreground text-sm font-semibold px-4 h-10 rounded-lg flex items-center hover:opacity-90 active:scale-95 transition-all"
                >
                  Log
                </Link>
              </motion.div>
            )}

            {/* 30-day milestone card */}
            <div className="bg-secondary-light border border-secondary/20 rounded-2xl p-4 flex items-start gap-3">
              <div className="flex-1">
                <div className="font-semibold text-sm">You've been here 30 days</div>
                <div className="text-xs text-text-2 mt-0.5">
                  Your fitness profile might have changed. Let's see if your recommendations still
                  fit.
                </div>
                <Link
                  to="/onboarding/reassess"
                  className="inline-block mt-2 text-sm font-semibold text-secondary hover:underline"
                >
                  Retake sport quiz →
                </Link>
              </div>
            </div>

            {/* Today's Workout */}
            <div className="bg-surface border border-border rounded-3xl p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                  Today's plan
                </span>
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-text-2">{todayWorkout.duration} min</span>
              </div>
              <h2 className="text-2xl font-semibold mb-3">{todayWorkout.title}</h2>
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 mb-5">
                {todayWorkout.exercises.map((e) => (
                  <span
                    key={e.id}
                    className="text-xs bg-surface-3 px-3 py-1.5 rounded-full whitespace-nowrap"
                  >
                    {e.name}
                  </span>
                ))}
              </div>
              <Link
                to="/coach/workout/$sessionId"
                params={{ sessionId: todayWorkout.id }}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <Play size={16} fill="currentColor" /> Start workout
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <Stat
                icon={<Flame size={16} />}
                label="Streak"
                value={`${currentUser.bestStreak}d`}
                accent="primary"
              />
              <Stat
                icon={<Activity size={16} />}
                label="This week"
                value="3 / 4"
                accent="secondary"
              />
              <Stat
                icon={<Award size={16} />}
                label="Last score"
                value={String(lastScore)}
                accent="secondary"
              />
            </div>

            {/* Coach preview */}
            <div className="bg-surface border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-semibold">
                  M
                </div>
                <span className="text-xs font-medium">MORF Coach</span>
                <span className="ml-auto text-[10px] text-text-3">just now</span>
              </div>
              <p className="text-sm text-text-2 line-clamp-2 mb-3">{lastChat.text}</p>
              <Link
                to="/coach/chat"
                className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                <MessageCircle size={14} /> Reply
              </Link>
            </div>
          </div>

          {/* Sidebar / Events */}
          <div className="mt-6 lg:mt-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Events near you</h2>
              <Link
                to="/community"
                className="text-xs text-text-2 hover:text-text-1 flex items-center gap-1"
              >
                See all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="lg:space-y-3 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
              {events.slice(0, 3).map((e) => (
                <EventCard key={e.id} event={e} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function MorfMark({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M16 4 L28 28 L22 28 L16 14 L10 28 L4 28 Z" fill="currentColor" />
      <path d="M11.5 22 L20.5 22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "primary" | "secondary";
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-3.5">
      <div
        className={`w-7 h-7 rounded-lg grid place-items-center mb-2 ${accent === "primary" ? "bg-primary-light text-primary" : "bg-secondary-light text-secondary"}`}
      >
        {icon}
      </div>
      <div className="font-semibold tabular text-xl">{value}</div>
      <div className="text-[11px] text-text-2 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
```

### src/routes/coach.index.tsx

```tsx
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
```

### src/routes/community.index.tsx

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EventCard } from "@/components/EventCard";
import { EmptyState, CrowdIllustration } from "@/components/EmptyState";
import { events } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community/")({
  head: () => ({ meta: [{ title: "Community — Athena" }] }),
  component: CommunityPage,
});

const filters = ["All", "Beginner-friendly", "Women only", "Free", "Adaptive access", "Casual"];

function CommunityPage() {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const filtered = events.filter((e) => {
    const matchQ =
      !q ||
      e.title.toLowerCase().includes(q.toLowerCase()) ||
      e.location.toLowerCase().includes(q.toLowerCase());
    const matchF =
      filter === "All" ||
      e.tags.some((t) => t.toLowerCase().includes(filter.toLowerCase().replace(" only", "-only")));
    return matchQ && matchF;
  });

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-3xl lg:text-4xl font-semibold">Community</h1>
          <Link
            to="/community/create"
            className="hidden lg:flex items-center gap-2 bg-primary text-primary-foreground h-10 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
          >
            <Plus size={16} /> Create event
          </Link>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events, places..."
            className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 h-11 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 -mx-4 px-4 lg:mx-0 lg:px-0 pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 px-4 h-9 rounded-full text-sm font-medium border transition-all active:scale-95",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface border-border hover:border-text-3",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<CrowdIllustration />}
            title="No events match"
            description="Try a different filter or be the first to create one."
            action={
              <Link
                to="/community/create"
                className="bg-primary text-primary-foreground h-10 px-4 rounded-lg text-sm font-semibold flex items-center hover:opacity-90 transition-all"
              >
                Create event
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>

      <Link
        to="/community/create"
        className="lg:hidden fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-lift)] hover:opacity-90 active:scale-90 transition-all"
        aria-label="Create event"
      >
        <Plus size={22} strokeWidth={2.5} />
      </Link>
    </AppShell>
  );
}
```

### src/routes/profile.index.tsx

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Bell, RefreshCw } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BadgeCard } from "@/components/BadgeCard";
import { currentUser, badges, weeklySessions } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { HealthProfileCard } from "@/components/HealthProfileCard";

export const Route = createFileRoute("/profile/")({
  head: () => ({ meta: [{ title: "Profile — Athena" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const reminders = useApp((s) => s.smartReminders);
  const toggle = useApp((s) => s.toggleSmartReminders);
  const unlocked = badges.filter((b) => b.unlockedAt);

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-3xl mx-auto space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground grid place-items-center text-2xl font-semibold">
            {currentUser.initials}
          </div>
          <div className="flex-1 pt-2">
            <h1 className="text-2xl font-semibold">{currentUser.name}</h1>
            <p className="text-xs text-text-2 mt-0.5">
              Member since April 2025 · {unlocked.length} achievements
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Sessions" value={String(currentUser.totalSessions)} />
          <Stat label="Best streak" value={`${currentUser.bestStreak}d`} />
          <Stat label="Analyses" value={String(currentUser.analysesDone)} />
        </div>

        <Card
          title="Achievements"
          right={
            <Link
              to="/profile/achievements"
              className="text-xs text-text-2 flex items-center gap-1 hover:text-text-1"
            >
              See all <ChevronRight size={12} />
            </Link>
          }
        >
          <div className="grid grid-cols-3 gap-3">
            {unlocked.slice(0, 3).map((b) => (
              <BadgeCard key={b.id} badge={b} size="sm" />
            ))}
          </div>
        </Card>

        <Card title="My sports">
          <div className="flex flex-wrap gap-2">
            {currentUser.sports.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium"
              >
                {s}
              </span>
            ))}
            <button className="px-3 py-1.5 rounded-full border border-dashed border-border text-sm text-text-2 hover:border-text-3">
              + Add
            </button>
          </div>
        </Card>

        <HealthProfileCard />

        <Card title="Sport profile">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">Last assessed April 12</div>
              <div className="text-xs text-text-2 mt-0.5">A lot can change in 30 days.</div>
            </div>
            <Link
              to="/onboarding/reassess"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <RefreshCw size={12} /> Update
            </Link>
          </div>
        </Card>

        <Card title="Weekly sessions">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessions}>
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-text-2)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="sessions" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Notifications">
          <Toggle
            label="Smart reminders"
            desc="Context-aware nudges from your coach"
            value={reminders}
            onChange={toggle}
          />
          <Link
            to="/profile/nudges"
            className="flex items-center justify-between text-sm py-2 hover:bg-surface-3 -mx-2 px-2 rounded-lg"
          >
            <span className="flex items-center gap-2">
              <Bell size={14} /> Nudge history
            </span>
            <ChevronRight size={14} className="text-text-3" />
          </Link>
        </Card>

        <Card title="Account">
          <div className="space-y-1 text-sm">
            <Row label="Email" value="sarah@athena.app" />
            <button className="w-full text-left py-2 hover:bg-surface-3 -mx-2 px-2 rounded-lg">
              Change password
            </button>
            <button className="w-full text-left py-2 text-destructive hover:bg-surface-3 -mx-2 px-2 rounded-lg">
              Delete account
            </button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 text-center">
      <div className="text-2xl font-semibold tabular">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-text-2 mt-1">{label}</div>
    </div>
  );
}

function Card({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-text-2">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Toggle({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs text-text-2 mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={onChange}
        role="switch"
        aria-checked={value}
        className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-primary" : "bg-surface-3"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
```

### src/routes/onboarding.tsx

```tsx
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
    <div className="min-h-dvh bg-background flex flex-col">
      <div className="h-1 bg-surface-3">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        {step > 1 && step < 4 ? (
          <button
            onClick={back}
            className="w-10 h-10 grid place-items-center rounded-lg hover:bg-surface-3"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-10" />
        )}
        {step === 1 && (
          <Link to="/dashboard" className="text-sm text-text-2 hover:text-text-1">
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
                <p className="text-text-2 mb-8">
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
                          "p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.97]",
                          active
                            ? "bg-primary-light border-primary"
                            : "bg-surface border-border hover:border-text-3",
                        )}
                      >
                        <div className="w-9 h-9 rounded-xl bg-surface-3 text-text-1 grid place-items-center mb-2">
                          <Icon size={18} />
                        </div>
                        <div className="font-medium text-sm leading-tight">{g.label}</div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" {...slide(direction)} className="space-y-7">
                <h1 className="text-3xl sm:text-4xl font-semibold">Tell us about yourself</h1>
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
                  <div className="text-sm font-medium mb-3">How do you feel about exercise?</div>
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
                              ? "bg-primary-light border-primary"
                              : "bg-surface border-border hover:border-text-3",
                          )}
                        >
                          <span className="text-sm font-semibold text-text-1">{c.value}</span>
                          <span className="text-[10px] text-text-2 leading-tight">{c.label}</span>
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
                  <h1 className="text-3xl sm:text-4xl font-semibold">We want to get this right</h1>
                  <p className="text-text-2 mt-2">This helps us personalize your experience.</p>
                </div>
                <div>
                  <div className="text-sm font-medium mb-3">Any physical considerations?</div>
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
                              ? "bg-primary-light border-primary text-primary"
                              : "bg-surface border-border",
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
                  <label className="text-sm font-medium mb-2 block">
                    Anything else we should know?
                  </label>
                  <textarea
                    placeholder="optional"
                    value={onboarding.notes}
                    onChange={(e) => setOnboarding({ notes: e.target.value })}
                    rows={3}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary"
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
                <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
                  Here's what we think you'll love
                </h1>
                <p className="text-text-2 mb-8">Three sports tuned to your answers.</p>
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
                  <h3 className="font-semibold mb-3">Your 4-week starter plan</h3>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
                    {[1, 2, 3, 4].map((w) => (
                      <div
                        key={w}
                        className="shrink-0 w-44 bg-surface border border-border rounded-2xl p-4"
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
                  className="text-sm text-text-2 hover:text-text-1 underline underline-offset-4 block mx-auto"
                >
                  I'll decide later
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!loading && !showResult && (
        <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border px-5 py-4">
          <div className="max-w-[480px] mx-auto">
            <button
              onClick={next}
              disabled={!canContinue}
              className={cn(
                "w-full h-12 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]",
                canContinue
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-surface-3 text-text-3 cursor-not-allowed",
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
                "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all active:scale-95",
                active
                  ? "bg-primary-light border-primary text-primary"
                  : "bg-surface border-border hover:border-text-3",
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
    <div className="bg-surface border border-border rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-9 h-9 rounded-full bg-surface-3 border border-border text-[11px] font-semibold grid place-items-center text-text-2"
              aria-hidden
            >
              {getInitials(sport.name)}
            </span>
            <h3 className="text-2xl font-semibold">{sport.name}</h3>
          </div>
          <p className="text-sm italic text-text-2">{sport.reason}</p>
        </div>
        <span className="text-[10px] font-semibold bg-secondary-light text-secondary px-2 py-1 rounded-full uppercase tracking-wider">
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
              <div key={c} className="border border-border rounded-xl p-4 mb-3 bg-surface">
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
                                  ? "bg-primary-light border-primary text-primary"
                                  : "bg-surface-2 border-border text-text-2 hover:border-text-3",
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
                        className="w-full h-10 bg-surface-2 border border-border rounded-lg px-3 text-sm focus:outline-none focus:border-primary"
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
                              ? "bg-primary-light border-primary text-primary"
                              : "bg-surface-2 border-border text-text-2 hover:border-text-3",
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
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm resize-none min-h-[72px] focus:outline-none focus:border-primary"
                />
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### src/styles.css

```css
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-display: "Instrument Serif", Georgia, serif;
  --font-mono: "Geist Mono", ui-monospace, "SF Mono", monospace;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-3xl: 28px;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-1: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-surface-3: var(--surface-3);

  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-light: var(--primary-light);
  --color-coral: var(--primary);
  --color-coral-subtle: var(--primary-light);

  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary-light: var(--secondary-light);
  --color-green: var(--secondary);
  --color-green-subtle: var(--secondary-light);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-warning: var(--warning);

  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-text-1: var(--text-1);
  --color-text-2: var(--text-2);
  --color-text-3: var(--text-3);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --shadow-soft: 0 1px 2px rgba(20, 18, 14, 0.04), 0 4px 16px -4px rgba(20, 18, 14, 0.06);
  --shadow-lift: 0 2px 4px rgba(20, 18, 14, 0.04), 0 12px 32px -8px rgba(20, 18, 14, 0.10);
}

:root {
  --radius: 1rem;

  --background: oklch(0.985 0.005 80);
  --foreground: oklch(0.18 0.01 60);
  --surface: oklch(1 0 0);
  --surface-2: oklch(0.985 0.005 80);
  --surface-3: oklch(0.955 0.008 75);

  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0.01 60);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.18 0.01 60);

  --primary: oklch(0.652 0.183 35);
  --primary-foreground: oklch(0.99 0.005 80);
  --primary-light: oklch(0.965 0.025 35);

  --secondary: oklch(0.55 0.13 155);
  --secondary-foreground: oklch(0.99 0.005 80);
  --secondary-light: oklch(0.95 0.04 150);

  --muted: oklch(0.955 0.008 75);
  --muted-foreground: oklch(0.5 0.012 60);
  --accent: oklch(0.955 0.008 75);
  --accent-foreground: oklch(0.18 0.01 60);

  --destructive: oklch(0.58 0.22 27);
  --destructive-foreground: oklch(0.99 0.005 80);
  --warning: oklch(0.7 0.16 60);

  --text-1: oklch(0.18 0.01 60);
  --text-2: oklch(0.5 0.012 60);
  --text-3: oklch(0.66 0.012 60);

  --border: oklch(0.91 0.008 80);
  --border-strong: oklch(0.82 0.01 75);
  --input: oklch(0.91 0.008 80);
  --ring: oklch(0.652 0.183 35);

  --chart-1: oklch(0.652 0.183 35);
  --chart-2: oklch(0.55 0.13 155);
  --chart-3: oklch(0.7 0.14 60);
  --chart-4: oklch(0.55 0.14 250);
  --chart-5: oklch(0.62 0.18 320);

  --sidebar: oklch(1 0 0);
  --sidebar-foreground: oklch(0.18 0.01 60);
  --sidebar-primary: oklch(0.652 0.183 35);
  --sidebar-primary-foreground: oklch(0.99 0.005 80);
  --sidebar-accent: oklch(0.955 0.008 75);
  --sidebar-accent-foreground: oklch(0.18 0.01 60);
  --sidebar-border: oklch(0.91 0.008 80);
  --sidebar-ring: oklch(0.652 0.183 35);
}

.dark {
  --background: oklch(0.155 0.005 70);
  --foreground: oklch(0.945 0.005 80);
  --surface: oklch(0.19 0.005 70);
  --surface-2: oklch(0.19 0.005 70);
  --surface-3: oklch(0.235 0.006 70);

  --card: oklch(0.19 0.005 70);
  --card-foreground: oklch(0.945 0.005 80);
  --popover: oklch(0.19 0.005 70);
  --popover-foreground: oklch(0.945 0.005 80);

  --primary: oklch(0.7 0.18 35);
  --primary-foreground: oklch(0.155 0.005 70);
  --primary-light: oklch(0.27 0.04 30);

  --secondary: oklch(0.65 0.16 155);
  --secondary-foreground: oklch(0.155 0.005 70);
  --secondary-light: oklch(0.255 0.05 150);

  --muted: oklch(0.235 0.006 70);
  --muted-foreground: oklch(0.7 0.008 70);
  --accent: oklch(0.235 0.006 70);
  --accent-foreground: oklch(0.945 0.005 80);

  --destructive: oklch(0.65 0.2 27);
  --destructive-foreground: oklch(0.99 0.005 80);
  --warning: oklch(0.78 0.15 65);

  --text-1: oklch(0.945 0.005 80);
  --text-2: oklch(0.7 0.008 70);
  --text-3: oklch(0.5 0.008 70);

  --border: oklch(0.28 0.006 70);
  --border-strong: oklch(0.38 0.006 70);
  --input: oklch(0.28 0.006 70);
  --ring: oklch(0.7 0.18 35);

  --sidebar: oklch(0.19 0.005 70);
  --sidebar-foreground: oklch(0.945 0.005 80);
  --sidebar-primary: oklch(0.7 0.18 35);
  --sidebar-primary-foreground: oklch(0.155 0.005 70);
  --sidebar-accent: oklch(0.235 0.006 70);
  --sidebar-accent-foreground: oklch(0.945 0.005 80);
  --sidebar-border: oklch(0.28 0.006 70);
  --sidebar-ring: oklch(0.7 0.18 35);
}

@layer base {
  @import url("https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap");

  * {
    border-color: var(--color-border);
  }

  html, body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-feature-settings: "ss01", "cv11";
  }

  body {
    text-wrap: pretty;
  }

  h1, h2, h3, h4 {
    letter-spacing: -0.03em;
    line-height: 1.15;
    font-weight: 500;
    text-wrap: balance;
    font-optical-sizing: auto;
  }

  .font-display {
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.02em;
  }

  .font-mono, .tabular {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }

  *:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { scrollbar-width: none; }

  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, var(--color-surface-3) 0%, var(--color-surface-2) 50%, var(--color-surface-3) 100%);
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite linear;
  }

  @keyframes pop {
    0% { transform: scale(0.96); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-pop { animation: pop 0.2s ease-out both; }

  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(3deg); }
  }
  .animate-wiggle { animation: wiggle 1.8s ease-in-out infinite; display: inline-block; transform-origin: 70% 70%; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    35% { transform: translateX(-3px); }
    70% { transform: translateX(3px); }
  }
  .animate-shake { animation: shake 0.3s ease-out; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  .liquid-glass {
    background: rgba(255, 255, 255, 0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }
  .liquid-glass::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1.4px;
    border-radius: inherit;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
      transparent 40%, transparent 60%,
      rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    pointer-events: none;
  }
  .liquid-glass-strong {
    background: rgba(255, 255, 255, 0.04);
    background-blend-mode: luminosity;
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    border: none;
    box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
    position: relative;
    overflow: hidden;
  }
  .liquid-glass-strong::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1.4px;
    border-radius: inherit;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 20%,
      transparent 40%, transparent 60%,
      rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.5) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    pointer-events: none;
  }

  .landing-page .liquid-glass,
  .landing-page .liquid-glass-strong {
    transform: translateZ(0);
  }

  .landing-minimal {
    background:
      radial-gradient(1100px 700px at 12% 10%, rgba(255, 255, 255, 0.08), transparent 60%),
      radial-gradient(900px 600px at 85% 70%, rgba(240, 107, 79, 0.12), transparent 60%),
      #0a0a09;
  }

  .hero-magazine {
    font-family: var(--font-display);
    font-style: normal;
    font-weight: 400;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }

  .hero-magazine em {
    font-family: var(--font-sans);
    font-style: normal;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .hero-highlight {
    display: inline;
    padding: 0.05em 0.22em;
    border-radius: 0.32em;
    background: linear-gradient(
      180deg,
      transparent 62%,
      rgba(255, 255, 255, 0.16) 62%,
      rgba(255, 255, 255, 0.1) 100%
    );
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }

  .hero-subline {
    display: inline;
    padding: 0.14em 0.26em;
    border-radius: 0.35em;
    background: rgba(255, 255, 255, 0.06);
    letter-spacing: 0.01em;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }

  .landing-card {
    background: linear-gradient(160deg, rgba(20, 20, 20, 0.98), rgba(8, 8, 8, 0.98));
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.04) inset,
      0 16px 40px rgba(0, 0, 0, 0.45);
    position: relative;
    overflow: hidden;
  }

  .landing-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 80% at 0% 0%, rgba(255, 255, 255, 0.08), transparent 55%);
    pointer-events: none;
  }

  .landing-card-strong {
    background: linear-gradient(170deg, rgba(24, 24, 24, 0.98), rgba(8, 8, 8, 0.98));
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.05) inset,
      0 22px 60px rgba(0, 0, 0, 0.55);
    position: relative;
    overflow: hidden;
  }

  .landing-card-strong::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(140% 90% at 15% -10%, rgba(255, 255, 255, 0.12), transparent 55%);
    pointer-events: none;
  }

  .landing-pill {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
  }

  .glass-pill {
    position: relative;
    border-radius: 9999px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.08) 55%,
      rgba(255, 255, 255, 0.03) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.22);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.38), inset 0 1px 2px rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    overflow: hidden;
  }

  .glass-pill::after {
    content: "";
    position: absolute;
    left: 10%;
    top: -45%;
    width: 80%;
    height: 85%;
    background: radial-gradient(
      ellipse at top,
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.0) 70%
    );
    opacity: 0.75;
    pointer-events: none;
  }

  .glass-pill--primary {
    background: linear-gradient(
      180deg,
      rgba(240, 107, 79, 0.38) 0%,
      rgba(255, 255, 255, 0.08) 60%,
      rgba(255, 255, 255, 0.04) 100%
    );
    border: 1px solid rgba(240, 107, 79, 0.45);
  }

  .app-loading {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: grid;
    place-items: center;
    background:
      radial-gradient(900px 600px at 20% 15%, rgba(255, 255, 255, 0.08), transparent 60%),
      radial-gradient(800px 520px at 85% 70%, rgba(240, 107, 79, 0.12), transparent 60%),
      #0a0a09;
    color: rgba(255, 255, 255, 0.9);
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .app-loading--hide {
    opacity: 0;
    pointer-events: none;
    transform: scale(1.05);
  }

  .app-loading__content {
    text-align: center;
    display: grid;
    gap: 12px;
  }

  .app-loading__label {
    font-size: 14px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
  }

  .app-loading__bar {
    width: 220px;
    height: 4px;
    border-radius: 999px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }

  .app-loading__bar span {
    display: block;
    height: 100%;
    width: 40%;
    border-radius: inherit;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(240, 107, 79, 0.7));
    animation: app-loading-bar 1.4s ease-in-out infinite;
  }

  @keyframes app-loading-bar {
    0% { transform: translateX(-120%); }
    60% { transform: translateX(220%); }
    100% { transform: translateX(220%); }
  }

  .landing-hero-stage {
    isolation: isolate;
    contain: paint;
    background: linear-gradient(135deg, #0f0f0e 0%, #1a1917 50%, #0d1f15 100%);
    background-attachment: fixed;
    background-size: cover;
    position: sticky;
  }

  .landing-hero-stage::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 1;
    pointer-events: none;
  }
}
```

---

## 2. Tech stack konfirmasi

- UI library: shadcn/ui (lihat components.json, folder src/components/ui) berbasis Radix UI (@radix-ui/*)
- State management: Zustand (src/lib/store.ts)
- Data fetching: TanStack Query (@tanstack/react-query, QueryClientProvider di __root.tsx)
- Animasi: Framer Motion (dipakai di dashboard, coach, onboarding, workout done, dll)
- Font: Geist, Geist Mono, Instrument Serif (diimport via Google Fonts di styles.css)

## 3. Visual referensi kondisi saat ini

- Screenshot belum tersedia (user meminta tidak perlu screenshot)

## 4. Fitur yang ada per halaman (ringkas)

- /profile/nudges: riwayat nudge (nudgeHistory dari mock-data), status acted/dismissed.
- /coach/workout/$sessionId/done: post-workout summary + feedback (too easy/just right/too hard) + optional notes.
- /analysis/result: result diambil dari analyses[0] (mock-data), bukan dari URL param.
- /onboarding/reassess: flow re-onboarding singkat (welcome + hasil comparison), lalu update/keep plan.
