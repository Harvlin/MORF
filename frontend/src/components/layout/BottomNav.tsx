import { Link, useRouterState } from "@tanstack/react-router";
import { House, Dumbbell, Video, Users, User } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: House },
  { to: "/coach", label: "Coach", icon: Dumbbell, dot: "checkin" as const },
  { to: "/analysis", label: "Analysis", icon: Video },
  { to: "/community", label: "Community", icon: Users, dot: "events" as const },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { location } = useRouterState();
  const checkinDone = useApp((s) => s.checkinDoneToday);

  if (
    location.pathname.startsWith("/coach/workout") ||
    location.pathname.startsWith("/coach/chat") ||
    location.pathname.startsWith("/onboarding")
  )
    return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[380px] z-40 lg:hidden">
      <nav className="nav-pill p-1.5 flex items-center justify-between gap-1">
        {items.map((item) => {
          const active =
            location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          const showDot = (item.dot === "checkin" && !checkinDone) || item.dot === "events";

          if (active) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all"
                style={{ background: "#D6E800", color: "#1C1C1A" }}
              >
                <Icon className="size-4" strokeWidth={2.5} />
                <span>{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative size-11 flex items-center justify-center rounded-full transition-all duration-200",
              )}
              style={{ color: "rgba(242,240,233,0.5)" }}
            >
              <Icon className="size-[19px]" strokeWidth={2} />
              {showDot && (
                <span
                  className="absolute top-1 right-1 size-2 rounded-full ring-2"
                  style={{ background: "#F5522A", ringColor: "rgba(30,30,27,0.9)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
