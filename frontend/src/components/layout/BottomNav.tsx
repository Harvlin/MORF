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

  if (
    location.pathname.startsWith("/coach/workout") ||
    location.pathname.startsWith("/coach/chat") ||
    location.pathname.startsWith("/onboarding")
  )
    return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[360px] z-40 lg:hidden">
      <nav className="nav-pill p-1.5 flex items-center justify-between">
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[color:var(--sage-deep)] text-white border-2 border-[color:var(--sage-deep)] ring-1 ring-white font-semibold text-sm transition-all"
              >
                <Icon className="size-4" strokeWidth={2.2} />
                <span>{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative size-10 flex items-center justify-center rounded-full text-[color:var(--sage-deep)] transition-colors",
              )}
            >
              <Icon className="size-[18px]" strokeWidth={2} />
              {showDot && (
                <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-[color:var(--ember)] ring-2 ring-white" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
