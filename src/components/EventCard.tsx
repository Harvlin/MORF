import type { EventItem } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";
import { Calendar, MapPin } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

const tagStyles: Record<string, string> = {
  "beginner-friendly": "bg-secondary-light text-secondary",
  "women-only": "bg-primary-light text-primary",
  "adaptive access":
    "bg-[oklch(0.95_0.04_250)] text-[oklch(0.45_0.14_250)] dark:bg-[oklch(0.27_0.06_250)] dark:text-[oklch(0.8_0.1_250)]",
  free: "bg-secondary-light text-secondary",
  casual: "bg-surface-3 text-text-2",
};

export function EventCard({ event, compact = false }: { event: EventItem; compact?: boolean }) {
  const full = event.joined >= event.capacity;
  return (
    <Link
      to="/community/$eventId"
      params={{ eventId: event.id }}
      className={cn(
        "block bg-surface border border-border rounded-2xl p-4 transition-all",
        "hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 active:scale-[0.99]",
        compact ? "w-72 shrink-0" : "w-full",
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-[15px] leading-tight flex-1">{event.title}</h3>
        <span
          className="w-10 h-10 rounded-full bg-surface-3 border border-border text-[11px] font-semibold grid place-items-center text-text-2 shrink-0"
          aria-hidden
        >
          {getInitials(event.sport)}
        </span>
      </div>
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-text-2">
          <Calendar size={12} />{" "}
          <span>
            {event.date} · {event.time}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-2">
          <MapPin size={12} /> <span className="truncate">{event.location}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {event.tags.map((t) => (
          <span
            key={t}
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full",
              tagStyles[t] || "bg-surface-3 text-text-2",
            )}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {Array.from({ length: Math.min(3, event.joined) }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-surface-3 border-2 border-surface text-[10px] grid place-items-center font-medium"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span className="text-xs text-text-2 tabular">
            {event.joined} / {event.capacity}
          </span>
        </div>
        <span
          className={cn(
            "text-xs font-semibold px-3 py-1.5 rounded-lg",
            full ? "bg-surface-3 text-text-3" : "border border-text-1 text-text-1",
          )}
        >
          {full ? "Full" : "Join"}
        </span>
      </div>
    </Link>
  );
}
