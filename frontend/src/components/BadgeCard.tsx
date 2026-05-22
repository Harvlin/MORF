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
          ? "card-frosted hover:-translate-y-0.5"
          : "card-frosted opacity-40",
      )}
    >
      <div
        className="w-12 h-12 rounded-full grid place-items-center text-xl mb-3 transition-all"
        style={
          unlocked
            ? {
                background: "rgba(214,232,0,0.12)",
                color: "#D6E800",
                border: "1px solid rgba(214,232,0,0.2)",
                boxShadow: "0 0 20px rgba(214,232,0,0.1)",
              }
            : {
                background: "rgba(242,240,233,0.05)",
                color: "rgba(242,240,233,0.25)",
              }
        }
      >
        <span aria-hidden>{getInitials(badge.name)}</span>
      </div>
      <div
        className="font-bold text-sm"
        style={{ color: unlocked ? "#F2F0E9" : "rgba(242,240,233,0.4)" }}
      >
        {unlocked ? badge.name : "???"}
      </div>
      {unlocked ? (
        <>
          <p className="text-xs mt-1 font-medium leading-snug" style={{ color: "rgba(242,240,233,0.5)" }}>
            {badge.description}
          </p>
          {size === "md" && (
            <p
              className="text-[10px] font-bold mt-2 uppercase tracking-wider"
              style={{ color: "rgba(214,232,0,0.5)" }}
            >
              {new Date(badge.unlockedAt!).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </>
      ) : (
        <div className="mt-2 flex items-center gap-1 font-bold" style={{ color: "rgba(242,240,233,0.3)" }}>
          <Lock size={10} /> <span className="text-[10px] uppercase tracking-wider">Locked</span>
        </div>
      )}
    </div>
  );
}
