import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Award, Activity, Play, ChevronRight, MessageCircle, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { NudgeBanner } from "@/components/NudgeBanner";
import { EventCard } from "@/components/EventCard";

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
      <div className="px-4 lg:px-10 py-5 lg:py-8 max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="font-display text-[clamp(28px,5vw,36px)] leading-tight" style={{ color: "#ffffff", fontWeight: 400 }}>
              {greet}, <strong style={{ fontWeight: 700 }}>{currentUser.name}!</strong><br />
              <span className="opacity-90 text-[clamp(18px,3vw,24px)]">here's your health snapshot for today.</span>
            </h1>
            <p className="text-[13px] mt-2 font-medium" style={{ color: "rgba(255, 255, 255, 0.7)" }}>Today is 01 November 2025</p>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.07 }}>
              <NudgeBanner />
            </motion.div>

            {/* Check-in banner */}
            {!checkinDone && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.14 }}
                className="card-frosted flex items-center gap-4 p-4"
              >
                <div
                  className="w-11 h-11 rounded-full grid place-items-center text-xl shrink-0"
                  style={{ background: "rgba(244,124,60,0.12)", color: "#f47c3c" }}
                >
                  <Zap size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-display text-[14px] font-semibold" style={{ color: "#0f2420" }}>How are you feeling today?</div>
                  <div className="text-[12px]" style={{ color: "#6e9e96" }}>Quick check-in helps tune your plan</div>
                </div>
                <Link
                  to="/coach"
                  className="flex items-center hover:opacity-90 active:scale-[0.97] transition-all"
                  style={{
                    background: "#1a3d35",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 700,
                    padding: "0 16px",
                    height: "36px",
                    borderRadius: "9999px",
                  }}
                >
                  Log
                </Link>
              </motion.div>
            )}

            {/* 30-day milestone card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.21 }}
              className="card-frosted-light p-4 flex items-start gap-3"
            >
              <div className="flex-1">
                <div className="font-display text-[14px] font-semibold" style={{ color: "#ffffff" }}>You've been here 30 days</div>
                <div className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>
                  Your fitness profile might have changed. Let's see if your recommendations still fit.
                </div>
                <Link
                  to="/onboarding/reassess"
                  className="inline-block mt-2 text-[13px] font-semibold hover:underline"
                  style={{ color: "#ffffff" }}
                >
                  Retake sport quiz →
                </Link>
              </div>
            </motion.div>

            {/* Today's Workout */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.28 }}
              className="card-frosted p-5 lg:p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: "#6e9e96" }}
                >
                  Today's plan
                </span>
                <span className="h-px flex-1" style={{ background: "rgba(0,0,0,0.08)" }} />
                <span className="text-[12px] tabular" style={{ color: "#3d6058" }}>{todayWorkout.duration} min</span>
              </div>
              <h2 className="text-[24px] font-display font-semibold mb-3" style={{ color: "#0f2420" }}>{todayWorkout.title}</h2>
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 mb-5">
                {todayWorkout.exercises.map((e) => (
                  <span
                    key={e.id}
                    className="text-[12px] font-medium px-3 h-7 inline-flex items-center whitespace-nowrap"
                    style={{ background: "rgba(255,255,255,0.40)", color: "#0f2420", borderRadius: "9999px", fontWeight: 600 }}
                  >
                    {e.name}
                  </span>
                ))}
              </div>
              <Link
                to="/coach/workout/$sessionId"
                params={{ sessionId: todayWorkout.id }}
                className="w-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all"
                style={{
                  background: "#1a3d35",
                  color: "#ffffff",
                  height: "52px",
                  borderRadius: "9999px",
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                <Play size={16} fill="currentColor" /> Start workout
              </Link>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="grid grid-cols-3 gap-3"
            >
              <Stat
                icon={<Flame size={16} />}
                label="Streak"
                value={`${currentUser.bestStreak}d`}
                accentBg="#ddeee8"
                accentColor="#1a3d35"
              />
              <Stat
                icon={<Activity size={16} />}
                label="This week"
                value="3 / 4"
                accentBg="rgba(244,124,60,0.12)"
                accentColor="#f47c3c"
              />
              <Stat
                icon={<Award size={16} />}
                label="Last score"
                value={String(lastScore)}
                accentBg="rgba(244,124,60,0.12)"
                accentColor="#f47c3c"
              />
            </motion.div>

            {/* Coach preview */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.42 }}
              className="card-frosted p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-semibold"
                  style={{ background: "#1a3d35", color: "#ffffff" }}
                >
                  M
                </div>
                <span className="text-[12px] font-medium" style={{ color: "#0f2420" }}>MORF Coach</span>
                <span className="ml-auto text-[11px]" style={{ color: "#6e9e96" }}>just now</span>
              </div>
              <p className="text-[13px] line-clamp-2 mb-3" style={{ color: "#3d6058" }}>{lastChat.text}</p>
              <Link
                to="/coach/chat"
                className="text-[13px] font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
                style={{ color: "#1a3d35" }}
              >
                <MessageCircle size={14} /> Reply
              </Link>
            </motion.div>
          </div>

          {/* Sidebar / Events */}
          <div className="mt-6 lg:mt-0 lg:sticky lg:top-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-[16px] font-semibold" style={{ color: "#ffffff" }}>Events near you</h2>
              <Link
                to="/community"
                className="text-[12px] flex items-center gap-1 hover:opacity-75"
                style={{ color: "rgba(255,255,255,0.8)" }}
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

function Stat({
  icon,
  label,
  value,
  accentBg,
  accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accentBg: string;
  accentColor: string;
}) {
  return (
    <div
      className="card-frosted p-4"
    >
      <div
        className="w-8 h-8 rounded-xl grid place-items-center mb-2"
        style={{ background: accentBg, color: accentColor }}
      >
        {icon}
      </div>
      <div
        className="font-semibold tabular leading-none whitespace-nowrap"
        style={{ fontSize: "44px", fontWeight: 800, color: "#0f2420" }}
      >
        {value}
      </div>
      <div
        className="uppercase tracking-wide mt-2"
        style={{ fontSize: "10px", color: "#6e9e96" }}
      >
        {label}
      </div>
    </div>
  );
}
