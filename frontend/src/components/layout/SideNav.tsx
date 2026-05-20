import { Link, useRouterState } from "@tanstack/react-router";
import { House, Dumbbell, Video, Users, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <aside className="glass hidden lg:flex fixed inset-y-4 left-4 w-60 flex-col px-4 py-6 z-30 rounded-[32px]">
      <Link to="/dashboard" className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 grid place-items-center font-bold text-white text-[15px] rounded-lg bg-[color:var(--sage-deep)]">
          M
        </div>
        <span className="text-xl font-bold tracking-tight text-white">MORF</span>
      </Link>

      <nav className="flex-1">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active =
              location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2 text-sm font-medium rounded-[10px] transition-colors",
                    active
                      ? "bg-[color:var(--sage-deep)] text-white font-semibold ring-1 ring-white/30"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
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

      <div className="border-t border-white/20 pt-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/15">
          <Sparkles size={14} className="text-white/90" />
          <span className="text-xs text-white/70">Beta build · v0.1</span>
        </div>
      </div>
    </aside>
  );
}
