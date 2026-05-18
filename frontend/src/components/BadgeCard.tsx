import type { Badge } from "@/lib/mock-data";
import { Lock } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

export function BadgeCard({ badge, size = "md" }: { badge: Badge; size?: "sm" | "md" }) {
  const unlocked = !!badge.unlockedAt;
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-4 flex flex-col items-center text-center transition-all",
        unlocked
          ? "bg-surface border-border hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5"
          : "bg-surface-3 border-transparent",
      )}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-full grid place-items-center text-2xl mb-3 transition-all",
          unlocked ? "bg-primary-light" : "bg-surface-2 grayscale opacity-50",
        )}
      >
        <span aria-hidden>{getInitials(badge.name)}</span>
      </div>
      <div className={cn("font-semibold text-sm", !unlocked && "text-text-3")}>
        {unlocked ? badge.name : "???"}
      </div>
      {unlocked ? (
        <>
          <p className="text-xs text-text-2 mt-1 leading-snug">{badge.description}</p>
          {size === "md" && (
            <p className="text-[10px] text-text-3 mt-2 uppercase tracking-wider">
              Unlocked{" "}
              {new Date(badge.unlockedAt!).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </>
      ) : (
        <div className="mt-2 flex items-center gap-1 text-text-3">
          <Lock size={10} /> <span className="text-[10px] uppercase tracking-wider">Locked</span>
        </div>
      )}
    </div>
  );
}
