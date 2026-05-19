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
