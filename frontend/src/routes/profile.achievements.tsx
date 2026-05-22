import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgeCard } from "@/components/BadgeCard";
import { badges } from "@/lib/mock-data";

export const Route = createFileRoute("/profile/achievements")({
  component: AchievementsPage,
});

function AchievementsPage() {
  const unlocked = badges.filter((b) => b.unlockedAt).length;
  const pct = (unlocked / badges.length) * 100;

  return (
    <div className="min-h-dvh" style={{ background: "linear-gradient(175deg, #1E1E1B 0%, #181816 100%)" }}>
      <PageHeader
        title="Achievements"
        back="/profile"
        subtitle={`${unlocked} of ${badges.length} unlocked`}
      />
      <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto pb-12">
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: "rgba(242,240,233,0.4)" }}>
            <span>Progress</span>
            <span style={{ color: "#D6E800" }}>{Math.round(pct)}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(242,240,233,0.07)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: "#D6E800",
                boxShadow: "0 0 8px rgba(214,232,0,0.3)",
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
