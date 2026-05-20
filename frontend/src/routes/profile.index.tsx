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
                  tick={{ fill: "#8aada5", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="sessions" radius={[8, 8, 0, 0]}>
                  {weeklySessions.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === weeklySessions.length - 1 ? "#1a3d35" : "#e2ece7"}
                    />
                  ))}
                </Bar>
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
