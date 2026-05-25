import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Award, Activity, Play, ChevronRight, MessageCircle, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { NudgeBanner } from "@/components/NudgeBanner";
import { EventCard } from "@/components/EventCard";
import { useColors } from "@/hooks/useColors";

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
  const c = useColors();

  return (
    <AppShell>
      <div className="px-4 lg:px-10 py-6 lg:py-8 max-w-6xl mx-auto">
        {/* Header greeting */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: c.violet }}>
              Today · Nov 01
            </p>
            <h1
              className="font-display leading-tight"
              style={{ fontSize: "clamp(26px,5vw,34px)", fontWeight: 800, color: c.textPrimary }}
            >
              {greet},{" "}
              <span style={{ color: c.sunGlare }}>{currentUser.name}!</span>
              <br />
              <span style={{ fontSize: "clamp(17px,2.8vw,22px)", fontWeight: 400, color: c.textSecondary }}>
                Here's your health snapshot.
              </span>
            </h1>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
          <div className="space-y-4">
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
                style={{ borderColor: `${c.exuberant}33` }}
              >
                <div
                  className="w-11 h-11 rounded-2xl grid place-items-center shrink-0"
                  style={{ background: c.exuberantBg, color: c.exuberant }}
                >
                  <Zap size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[14px]" style={{ color: c.textPrimary }}>
                    How are you feeling today?
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: c.textSecondary }}>
                    Quick check-in helps tune your plan
                  </div>
                </div>
                <Link
                  to="/coach"
                  className="flex items-center hover:opacity-90 active:scale-[0.97] transition-all"
                  style={{
                    background: c.exuberant,
                    color: "#F2F0E9",
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
              style={{ borderColor: `${c.violet}33` }}
            >
              <div
                className="w-9 h-9 rounded-xl grid place-items-center shrink-0 mt-0.5"
                style={{ background: c.violetBg, color: c.violet }}
              >
                <Award size={16} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[14px]" style={{ color: c.textPrimary }}>
                  You've been here 30 days
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: c.textSecondary }}>
                  Your fitness profile might have changed. Let's see if your recommendations still fit.
                </div>
                <Link
                  to="/onboarding/reassess"
                  className="inline-block mt-2 text-[13px] font-bold hover:underline"
                  style={{ color: c.violet }}
                >
                  Retake sport quiz →
                </Link>
              </div>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.28 }}
              className="grid grid-cols-3 gap-3"
            >
              <Stat icon={<Flame size={16} />} label="Streak"    value={`${currentUser.bestStreak}d`} accentBg={c.exuberantBg} accentColor={c.exuberant} textColor={c.textPrimary} labelColor={c.textTertiary} />
              <Stat icon={<Activity size={16} />} label="This week" value="3 / 4" accentBg={c.violetBg} accentColor={c.violet} textColor={c.textPrimary} labelColor={c.textTertiary} />
              <Stat icon={<Award size={16} />}    label="Last score" value={String(lastScore)} accentBg={c.sunGlareBg} accentColor={c.sunGlare} textColor={c.textPrimary} labelColor={c.textTertiary} />
            </motion.div>

            {/* Today's Workout */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="card-frosted p-5 lg:p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: c.textTertiary }}
                >
                  Today's plan
                </span>
                <span className="h-px flex-1" style={{ background: c.divider }} />
                <span
                  className="text-[11px] tabular font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: c.exuberantBg, color: c.exuberant }}
                >
                  {todayWorkout.duration} min
                </span>
              </div>
              <h2
                className="font-display font-bold mb-3"
                style={{ fontSize: "22px", color: c.textPrimary }}
              >
                {todayWorkout.title}
              </h2>
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 mb-5">
                {todayWorkout.exercises.map((e) => (
                  <span
                    key={e.id}
                    className="text-[12px] font-semibold px-3 h-7 inline-flex items-center whitespace-nowrap rounded-full"
                    style={{ background: c.exerciseChipBg, color: c.exerciseChipColor, border: `1px solid ${c.exerciseChipBorder}` }}
                  >
                    {e.name}
                  </span>
                ))}
              </div>
              <Link
                to="/coach/workout/$sessionId"
                params={{ sessionId: todayWorkout.id }}
                className="w-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all font-bold"
                style={{
                  background: c.sunGlare,
                  color: "#1C1C1A",
                  height: "52px",
                  borderRadius: "9999px",
                  fontSize: "15px",
                  boxShadow: `0 0 32px ${c.sunGlareBg}`,
                }}
              >
                <Play size={16} fill="currentColor" /> Start workout
              </Link>
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
                  className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold"
                  style={{ background: c.coachAvatarBg, color: c.coachAvatarColor }}
                >
                  M
                </div>
                <span className="text-[12px] font-semibold" style={{ color: c.textPrimary }}>MORF Coach</span>
                <span className="ml-auto text-[11px]" style={{ color: c.textTertiary }}>just now</span>
              </div>
              <p className="text-[13px] line-clamp-2 mb-3 font-medium" style={{ color: c.textSecondary }}>
                {lastChat.text}
              </p>
              <Link
                to="/coach/chat"
                className="text-[13px] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
                style={{ color: c.exuberant }}
              >
                <MessageCircle size={14} /> Reply
              </Link>
            </motion.div>
          </div>

          {/* Sidebar / Events */}
          <div className="mt-6 lg:mt-0 lg:sticky lg:top-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[15px]" style={{ color: c.textPrimary }}>Events near you</h2>
              <Link
                to="/community"
                className="text-[12px] flex items-center gap-1 font-medium hover:opacity-75 transition-opacity"
                style={{ color: c.textTertiary }}
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
  icon, label, value, accentBg, accentColor, textColor, labelColor,
}: {
  icon: React.ReactNode; label: string; value: string;
  accentBg: string; accentColor: string; textColor: string; labelColor: string;
}) {
  return (
    <div className="card-frosted p-4">
      <div className="w-8 h-8 rounded-xl grid place-items-center mb-3" style={{ background: accentBg, color: accentColor }}>
        {icon}
      </div>
      <div className="font-black tabular leading-none whitespace-nowrap" style={{ fontSize: "36px", color: textColor }}>
        {value}
      </div>
      <div className="uppercase tracking-wider mt-2 font-semibold" style={{ fontSize: "10px", color: labelColor }}>
        {label}
      </div>
    </div>
  );
}
