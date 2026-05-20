import type { Badge } from "@/lib/mock-data";
import { Lock } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

export function BadgeCard({ badge, size = "md" }: { badge: Badge; size?: "sm" | "md" }) {
  const unlocked = !!badge.unlockedAt;
  return (
    <div
      className={cn(
        "relative rounded-2xl p-4 flex flex-col items-center text-center transition-all",
        unlocked
          ? "card-frosted hover:shadow-xl hover:-translate-y-0.5 border border-white"
          : "card-frosted !bg-[rgba(255,255,255,0.1)] border-transparent opacity-60",
      )}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-full grid place-items-center text-2xl mb-3 transition-all",
          unlocked ? "bg-[#1a3d35] text-white shadow" : "bg-[rgba(15,36,32,0.1)] text-[#0f2420]",
        )}
      >
        <span aria-hidden>{getInitials(badge.name)}</span>
      </div>
      <div className={cn("font-bold text-sm", !unlocked ? "text-[var(--foreground)] opacity-70" : "text-[var(--foreground)]")}>
        {unlocked ? badge.name : "???"}
      </div>
      {unlocked ? (
        <>
          <p className="text-xs text-[var(--foreground)] opacity-70 mt-1 font-medium leading-snug">{badge.description}</p>
          {size === "md" && (
            <p className="text-[10px] text-[var(--foreground)] opacity-50 font-bold mt-2 uppercase tracking-wider">
              Unlocked{" "}
              {new Date(badge.unlockedAt!).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </>
      ) : (
        <div className="mt-2 flex items-center gap-1 text-[var(--foreground)] opacity-70 font-bold">
          <Lock size={10} /> <span className="text-[10px] uppercase tracking-wider">Locked</span>
        </div>
      )}
    </div>
  );
}
