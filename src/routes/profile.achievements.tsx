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
    <div className="min-h-dvh bg-background">
      <PageHeader
        title="Achievements"
        back="/profile"
        subtitle={`${unlocked} of ${badges.length} unlocked`}
      />
      <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto pb-12">
        <div className="mb-6">
          <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{ width: `${pct}%` }}
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
