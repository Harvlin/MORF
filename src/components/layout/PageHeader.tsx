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
    <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border px-4 lg:px-8 py-3 flex items-center gap-3">
      {back && (
        <Link
          to={back}
          className="w-10 h-10 -ml-2 grid place-items-center rounded-lg hover:bg-surface-3 text-text-1"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold truncate">{title}</h1>
        {subtitle && <p className="text-xs text-text-2 truncate">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
