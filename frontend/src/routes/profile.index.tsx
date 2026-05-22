import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Bell, RefreshCw } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BadgeCard } from "@/components/BadgeCard";
import { currentUser, badges, weeklySessions } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { HealthProfileCard } from "@/components/HealthProfileCard";

export const Route = createFileRoute("/profile/")({
  head: () => ({ meta: [{ title: "Profile — MORF" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const reminders = useApp((s) => s.smartReminders);
  const toggle = useApp((s) => s.toggleSmartReminders);
  const unlocked = badges.filter((b) => b.unlockedAt);

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-3xl mx-auto space-y-5">

        {/* Profile header */}
        <div className="flex items-start gap-4">
          <div
            className="w-20 h-20 rounded-3xl grid place-items-center text-[26px] font-black"
            style={{ background: "#6B5FC3", color: "#F2F0E9" }}
          >
            {currentUser.initials}
          </div>
          <div className="flex-1 pt-2">
            <h1 className="text-[24px] font-black" style={{ color: "#F2F0E9" }}>
              {currentUser.name}
            </h1>
            <p className="text-xs mt-0.5 font-medium" style={{ color: "rgba(242,240,233,0.45)" }}>
              Member since April 2025 · {unlocked.length} achievements
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Sessions" value={String(currentUser.totalSessions)} accent="#D6E800" />
          <Stat label="Best streak" value={`${currentUser.bestStreak}d`} accent="#F5522A" />
          <Stat label="Analyses" value={String(currentUser.analysesDone)} accent="#6B5FC3" />
        </div>

        {/* Weekly sessions chart */}
        <Card title="Weekly sessions">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessions}>
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(242,240,233,0.4)", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(242,240,233,0.03)" }}
                  contentStyle={{
                    background: "rgba(30,30,27,0.95)",
                    border: "1px solid rgba(242,240,233,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#F2F0E9",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                />
                <Bar dataKey="sessions" radius={[8, 8, 0, 0]}>
                  {weeklySessions.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === weeklySessions.length - 1
                          ? "#F5522A"
                          : "rgba(245,82,42,0.12)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <HealthProfileCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            title="Achievements"
            right={
              <Link
                to="/profile/achievements"
                className="text-xs flex items-center gap-1 hover:opacity-100 font-semibold transition-opacity"
                style={{ color: "rgba(242,240,233,0.4)" }}
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
                  className="px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: "rgba(107,95,195,0.08)", color: "#6B5FC3", border: "1px solid rgba(107,95,195,0.15)" }}
                >
                  {s}
                </span>
              ))}
              <button
                className="px-3 py-1.5 rounded-full border-dashed text-sm font-medium transition-colors"
                style={{ border: "1px dashed rgba(242,240,233,0.15)", color: "rgba(242,240,233,0.35)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(242,240,233,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(242,240,233,0.15)")}
              >
                + Add
              </button>
            </div>
            <div
              className="mt-4 pt-4 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(242,240,233,0.07)" }}
            >
              <div>
                <div className="text-sm font-semibold" style={{ color: "#F2F0E9" }}>Sport profile</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(242,240,233,0.4)" }}>Last assessed April 12</div>
              </div>
              <Link
                to="/onboarding/reassess"
                className="inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
                style={{ color: "#F5522A" }}
              >
                <RefreshCw size={12} /> Update
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Notifications">
            <Toggle
              label="Smart reminders"
              desc="Context-aware nudges from your coach"
              value={reminders}
              onChange={toggle}
            />
            <Link
              to="/profile/nudges"
              className="flex items-center justify-between text-sm py-2 -mx-2 px-2 rounded-lg transition-colors"
              style={{ color: "#F2F0E9" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span className="flex items-center gap-2 font-medium">
                <Bell size={14} /> Nudge history
              </span>
              <ChevronRight size={14} style={{ color: "rgba(242,240,233,0.3)" }} />
            </Link>
          </Card>

          <Card title="Account">
            <div className="space-y-1 text-sm" style={{ color: "#F2F0E9" }}>
              <Row label="Email" value="sarah@athena.app" />
              <button
                className="w-full text-left py-2 font-medium -mx-2 px-2 rounded-lg transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Change password
              </button>
              <button
                className="w-full text-left py-2 font-medium -mx-2 px-2 rounded-lg transition-colors"
                style={{ color: "#F5522A" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,82,42,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Delete account
              </button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="card-frosted p-4 text-center">
      <div
        className="tabular font-black"
        style={{ fontSize: "28px", color: accent }}
      >
        {value}
      </div>
      <div
        className="uppercase tracking-[0.1em] mt-1 font-semibold"
        style={{ fontSize: "10px", color: "rgba(242,240,233,0.4)" }}
      >
        {label}
      </div>
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
    <div className="card-frosted p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[13px] uppercase tracking-[0.1em]" style={{ color: "rgba(242,240,233,0.45)" }}>
          {title}
        </h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ color: "#F2F0E9" }}>
      <span className="font-medium" style={{ color: "rgba(242,240,233,0.5)" }}>{label}</span>
      <span className="font-semibold">{value}</span>
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
    <div className="flex items-center justify-between py-2" style={{ color: "#F2F0E9" }}>
      <div>
        <div className="text-sm font-semibold">{label}</div>
        {desc && <div className="text-xs mt-0.5" style={{ color: "rgba(242,240,233,0.45)" }}>{desc}</div>}
      </div>
      <button
        onClick={onChange}
        role="switch"
        aria-checked={value}
        className="w-11 h-6 rounded-full transition-all relative"
        style={{ background: value ? "#D6E800" : "rgba(242,240,233,0.1)" }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full shadow transition-all"
          style={{
            background: value ? "#1C1C1A" : "rgba(242,240,233,0.5)",
            left: value ? "22px" : "2px",
          }}
        />
      </button>
    </div>
  );
}
