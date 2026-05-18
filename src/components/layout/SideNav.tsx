import { Link, useRouterState } from "@tanstack/react-router";
import { House, Dumbbell, Video, Users, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const items = [
  { to: "/dashboard", label: "Home", icon: House },
  { to: "/coach", label: "Coach", icon: Dumbbell },
  { to: "/analysis", label: "Analysis", icon: Video },
  { to: "/community", label: "Community", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
];

export function SideNav() {
  const { location } = useRouterState();
  if (location.pathname.startsWith("/onboarding") || location.pathname.startsWith("/coach/workout"))
    return null;

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-border bg-surface px-4 py-6 z-30">
      <Link to="/dashboard" className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-semibold">
          M
        </div>
        <span className="text-xl font-semibold tracking-tight">MORF</span>
      </Link>

      <nav className="flex-1">
        <ul className="space-y-1">
          {items.map((item) => {
            const active =
              location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-light text-primary"
                      : "text-text-2 hover:bg-surface-3 hover:text-text-1",
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border pt-4 space-y-3">
        <div className="px-3 flex items-center justify-between">
          <span className="text-xs text-text-2">Theme</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-3">
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs text-text-2">Beta build · v0.1</span>
        </div>
      </div>
    </aside>
  );
}
