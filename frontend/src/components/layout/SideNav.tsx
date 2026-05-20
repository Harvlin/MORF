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
    <aside className="card-frosted hidden lg:flex fixed inset-y-4 left-4 w-60 flex-col px-4 py-6 z-30 border-none" style={{ borderRadius: "32px" }}>
      <Link to="/dashboard" className="flex items-center gap-2 px-2 mb-8">
        <div
          className="w-8 h-8 grid place-items-center font-bold text-white text-[15px]"
          style={{ background: "#1a3d35", borderRadius: "8px" }}
        >
          M
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ color: "#0f2420" }}>MORF</span>
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
                    "flex items-center gap-3 px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-white"
                      : "hover:bg-[rgba(0,0,0,0.04)]",
                  )}
                  style={{
                    borderRadius: "10px",
                    background: active ? "#1a3d35" : undefined,
                    color: active ? "#ffffff" : "#4a6b62",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t pt-4 space-y-3" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ borderRadius: "8px", background: "#f0f5f2" }}
        >
          <Sparkles size={14} style={{ color: "#1a3d35" }} />
          <span className="text-xs" style={{ color: "#3d6058" }}>Beta build · v0.1</span>
        </div>
      </div>
    </aside>
  );
}
