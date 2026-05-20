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
          <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground grid place-items-center text-[24px] font-bold text-text-1">
            {currentUser.initials}
          </div>
          <div className="flex-1 pt-2">
            <h1 className="text-[24px] font-bold text-text-1">{currentUser.name}</h1>
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

        <Card title="Weekly sessions">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessions}>
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#0f2420", fontSize: 11, opacity: 0.7 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#0f2420",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
                  }}
                />
                <Bar dataKey="sessions" radius={[8, 8, 0, 0]}>
                  {weeklySessions.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === weeklySessions.length - 1 ? "#1a3d35" : "rgba(26,61,53,0.15)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <HealthProfileCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title="Achievements"
            right={
              <Link
                to="/profile/achievements"
                className="text-xs text-[var(--foreground)] opacity-70 flex items-center gap-1 hover:opacity-100"
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
                  className="px-3 py-1.5 rounded-full bg-[rgba(26,61,53,0.1)] text-[#1a3d35] text-sm font-semibold"
                >
                  {s}
                </span>
              ))}
              <button className="px-3 py-1.5 rounded-full border border-dashed border-[#1a3d35]/30 text-sm text-[#1a3d35]/70 hover:border-[#1a3d35]/60 transition-colors">
                + Add
              </button>
            </div>
            <div className="mt-5 pt-4 border-t border-[#0f2420]/10 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[#0f2420]">Sport profile</div>
                <div className="text-xs text-[#0f2420]/60 mt-0.5">Last assessed April 12</div>
              </div>
              <Link
                to="/onboarding/reassess"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a3d35] hover:underline"
              >
                <RefreshCw size={12} /> Update
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Notifications">
            <Toggle
              label="Smart reminders"
              desc="Context-aware nudges from your coach"
              value={reminders}
              onChange={toggle}
            />
            <Link
              to="/profile/nudges"
              className="flex items-center justify-between text-sm py-2 hover:bg-[#0f2420]/5 -mx-2 px-2 rounded-lg text-[#0f2420]"
            >
              <span className="flex items-center gap-2 font-medium">
                <Bell size={14} /> Nudge history
              </span>
              <ChevronRight size={14} className="opacity-50" />
            </Link>
          </Card>

          <Card title="Account">
            <div className="space-y-1 text-sm text-[#0f2420]">
              <Row label="Email" value="sarah@athena.app" />
              <button className="w-full text-left py-2 hover:bg-[#0f2420]/5 font-medium -mx-2 px-2 rounded-lg transition-colors">
                Change password
              </button>
              <button className="w-full text-left py-2 text-destructive font-medium hover:bg-destructive/10 -mx-2 px-2 rounded-lg transition-colors">
                Delete account
              </button>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="card-frosted p-4 text-center"
    >
      <div className="tabular" style={{ fontSize: "26px", fontWeight: 800, color: "#0f2420" }}>{value}</div>
      <div className="uppercase tracking-[0.08em] mt-1" style={{ fontSize: "11px", color: "#6e9e96" }}>{label}</div>
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
        <h2 className="font-semibold text-sm text-[#0f2420]">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-[#0f2420]">
      <span className="opacity-70 font-medium">{label}</span>
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
    <div className="flex items-center justify-between py-2 text-[#0f2420]">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        {desc && <div className="text-xs opacity-70 mt-0.5">{desc}</div>}
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
