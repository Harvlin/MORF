import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  back,
  right,
  subtitle,
}: {
  title: string;
  back?: string;
  right?: ReactNode;
  subtitle?: string;
}) {
  return (
    <header
      className="sticky top-0 z-20 px-4 lg:px-8 py-3 flex items-center gap-3"
      style={{
        background: "rgba(24,24,22,0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(242,240,233,0.06)",
      }}
    >
      {back && (
        <Link
          to={back}
          className="w-9 h-9 shrink-0 grid place-items-center rounded-xl transition-colors"
          style={{ color: "rgba(242,240,233,0.55)", border: "1px solid rgba(242,240,233,0.09)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(242,240,233,0.07)"; e.currentTarget.style.color = "#F2F0E9"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(242,240,233,0.55)"; }}
          aria-label="Back"
        >
          <ChevronLeft size={18} />
        </Link>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold truncate" style={{ color: "#F2F0E9" }}>{title}</h1>
        {subtitle && (
          <p className="text-xs font-semibold truncate" style={{ color: "rgba(242,240,233,0.45)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </header>
  );
}
