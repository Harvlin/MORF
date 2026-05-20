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
    <header className="sticky top-0 z-20 px-4 lg:px-8 py-3 flex items-center gap-3 bg-transparent">
      {back && (
        <Link to={back} className="icon-btn-glass shrink-0" aria-label="Back">
          <ChevronLeft size={18} />
        </Link>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold truncate text-[var(--foreground)]">{title}</h1>
        {subtitle && <p className="text-xs text-[var(--foreground)] opacity-70 font-semibold truncate">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
