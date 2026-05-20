import { Link, useRouterState } from "@tanstack/react-router";
import { House, Dumbbell, Users, User } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: House },
  { to: "/coach", label: "Coach", icon: Dumbbell, dot: "checkin" as const },
  { to: "/community", label: "Community", icon: Users, dot: "events" as const },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { location } = useRouterState();
  const checkinDone = useApp((s) => s.checkinDoneToday);

  // hide on workout focus mode and chat
  if (
    location.pathname.startsWith("/coach/workout") ||
    location.pathname.startsWith("/coach/chat") ||
    location.pathname.startsWith("/onboarding")
  )
    return null;

  return (
    <nav
      className="nav-pill fixed bottom-[20px] left-1/2 -translate-x-1/2 z-40 lg:hidden flex items-center gap-1 w-fit"
      style={{
        padding: "6px 8px",
        height: "56px",
      }}
    >
      {items.map((item) => {
        const active =
          location.pathname === item.to || location.pathname.startsWith(item.to + "/");
        const Icon = item.icon;
        const showDot = (item.dot === "checkin" && !checkinDone) || item.dot === "events";
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "relative flex items-center justify-center gap-2 h-[44px] transition-all duration-200",
              active ? "px-4 font-semibold text-[14px]" : "px-3"
            )}
            style={{
              borderRadius: "9999px",
              background: active ? "var(--color-primary)" : "transparent",
              color: active ? "#ffffff" : "var(--color-text-dark)",
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            {showDot && !active && (
              <span
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{ background: "#1a3d35", outline: "2px solid #ffffff" }}
              />
            )}
            {active && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
