import type { EventItem } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";
import { MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const tagStyles: Record<string, { bg: string; color: string }> = {
  "beginner-friendly": { bg: "#ddeee8", color: "#1a3d35" },
  "women-only":        { bg: "#f0e0f0", color: "#7b3f7b" },
  "adaptive access":   { bg: "#1a3d35", color: "#ffffff" },
  "adaptive-access":   { bg: "#1a3d35", color: "#ffffff" },
  free:                { bg: "#dcf0de", color: "#2d6b32" },
  casual:              { bg: "#e2ece7", color: "#3d6058" },
};

function TagPill({ tag }: { tag: string }) {
  const style = tagStyles[tag] || { bg: "#e2ece7", color: "#3d6058" };
  return (
    <span
      className="text-[11px] font-semibold inline-flex items-center"
      style={{
        background: style.bg,
        color: style.color,
        borderRadius: "9999px",
        padding: "2px 10px",
      }}
    >
      {tag}
    </span>
  );
}

export function EventCard({ event, compact = false }: { event: EventItem; compact?: boolean }) {
  const full = event.joined >= event.capacity;
  const ratio = Math.min(1, event.joined / event.capacity);

  // Generate fake avatar initials from event id for consistency
  const avatars = ["A", "B", "C"];

  return (
    <Link
      to="/community/$eventId"
      params={{ eventId: event.id }}
      className={cn(
        "card-frosted block transition-all",
        compact ? "w-[260px] shrink-0 p-3" : "w-full p-4",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="text-[11px] font-semibold grid place-items-center shrink-0"
          aria-hidden
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "9999px",
            background: "#e2ece7",
            color: "#3d6058",
          }}
        >
          {event.sport.slice(0, 2).toUpperCase()}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold leading-tight truncate"
            style={{ fontSize: "15px", color: "#0f2420" }}
          >
            {event.title}
          </h3>

          {!compact && (
            <>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Calendar size={14} style={{ color: "#6e9e96", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: "#3d6058" }}>
                  {event.date} · {event.time}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={14} style={{ color: "#6e9e96", flexShrink: 0 }} />
                <span className="truncate" style={{ fontSize: "13px", color: "#3d6058" }}>
                  {event.location}
                </span>
              </div>
            </>
          )}

          {compact && (
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} style={{ color: "#3d6058", flexShrink: 0 }} />
              <span className="truncate" style={{ fontSize: "12px", color: "#3d6058" }}>
                {event.location}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={cn("flex flex-wrap gap-1.5", compact ? "mt-2" : "mt-3")}>
        {event.tags.map((t) => (
          <TagPill key={t} tag={t} />
        ))}
      </div>

      <div className={cn("flex items-center justify-between", compact ? "mt-2" : "mt-3")}>
        <div className="flex items-center gap-2">
          {/* Avatar circles */}
          <div className="flex -space-x-1">
            {avatars.slice(0, 3).map((a, i) => (
              <span
                key={i}
                className="grid place-items-center font-semibold"
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "9999px",
                  background: "#e2ece7",
                  color: "#3d6058",
                  fontSize: "10px",
                  outline: "2px solid #ffffff",
                }}
              >
                {a}
              </span>
            ))}
          </div>
          <span style={{ fontSize: "11px", color: "#6e9e96" }}>
            {event.joined} / {event.capacity}
          </span>
          <div
            className="overflow-hidden"
            style={{ height: "3px", width: "56px", borderRadius: "9999px", background: "#e2ece7" }}
          >
            <div
              style={{
                height: "100%",
                width: `${ratio * 100}%`,
                background: "#1a3d35",
              }}
            />
          </div>
        </div>
        {!compact && (
          <span
            className={cn(
              "font-semibold flex items-center justify-center",
            )}
            style={{
              fontSize: "13px",
              height: "32px",
              padding: "0 14px",
              borderRadius: "9999px",
              border: "1px solid rgba(0,0,0,0.15)",
              background: "transparent",
              color: full ? "#8aada5" : "#0f2420",
            }}
          >
            {full ? "Full" : "Join"}
          </span>
        )}
      </div>
    </Link>
  );
}
