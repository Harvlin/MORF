import type { EventItem } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";
import { MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const tagStyles: Record<string, { bg: string; color: string }> = {
  "beginner-friendly": { bg: "rgba(214,232,0,0.12)", color: "#D6E800" },
  "women-only":        { bg: "rgba(107,95,195,0.15)", color: "#8B80D4" },
  "adaptive access":   { bg: "rgba(245,82,42,0.15)", color: "#F5522A" },
  "adaptive-access":   { bg: "rgba(245,82,42,0.15)", color: "#F5522A" },
  free:                { bg: "rgba(214,232,0,0.08)", color: "#A8B800" },
  casual:              { bg: "rgba(242,240,233,0.08)", color: "rgba(242,240,233,0.6)" },
};

function TagPill({ tag }: { tag: string }) {
  const style = tagStyles[tag] || { bg: "rgba(242,240,233,0.08)", color: "rgba(242,240,233,0.6)" };
  return (
    <span
      className="text-[11px] font-semibold inline-flex items-center"
      style={{
        background: style.bg,
        color: style.color,
        borderRadius: "9999px",
        padding: "2px 10px",
        border: `1px solid ${style.color}22`,
      }}
    >
      {tag}
    </span>
  );
}

export function EventCard({ event, compact = false }: { event: EventItem; compact?: boolean }) {
  const full = event.joined >= event.capacity;
  const ratio = Math.min(1, event.joined / event.capacity);

  const avatars = ["A", "B", "C"];

  return (
    <Link
      to="/community/$eventId"
      params={{ eventId: event.id }}
      className={cn(
        "card-frosted block transition-all hover:border-white/15 group",
        compact ? "w-[260px] shrink-0 p-3" : "w-full p-4",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="text-[11px] font-bold grid place-items-center shrink-0"
          aria-hidden
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "rgba(214,232,0,0.1)",
            color: "#D6E800",
            border: "1px solid rgba(214,232,0,0.2)",
          }}
        >
          {event.sport.slice(0, 2).toUpperCase()}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold leading-tight truncate"
            style={{ fontSize: "15px", color: "#F2F0E9" }}
          >
            {event.title}
          </h3>

          {!compact && (
            <>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Calendar size={13} style={{ color: "rgba(242,240,233,0.35)", flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: "rgba(242,240,233,0.55)" }}>
                  {event.date} · {event.time}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={13} style={{ color: "rgba(242,240,233,0.35)", flexShrink: 0 }} />
                <span className="truncate" style={{ fontSize: "12px", color: "rgba(242,240,233,0.55)" }}>
                  {event.location}
                </span>
              </div>
            </>
          )}

          {compact && (
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={11} style={{ color: "rgba(242,240,233,0.35)", flexShrink: 0 }} />
              <span className="truncate" style={{ fontSize: "11px", color: "rgba(242,240,233,0.5)" }}>
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
          <div className="flex -space-x-1.5">
            {avatars.slice(0, 3).map((a, i) => (
              <span
                key={i}
                className="grid place-items-center font-bold"
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "9999px",
                  background: i === 0 ? "rgba(214,232,0,0.15)" : i === 1 ? "rgba(245,82,42,0.15)" : "rgba(107,95,195,0.15)",
                  color: i === 0 ? "#D6E800" : i === 1 ? "#F5522A" : "#6B5FC3",
                  fontSize: "9px",
                  outline: "2px solid rgba(30,30,27,0.9)",
                }}
              >
                {a}
              </span>
            ))}
          </div>
          <span style={{ fontSize: "11px", color: "rgba(242,240,233,0.4)" }}>
            {event.joined} / {event.capacity}
          </span>
          <div
            className="overflow-hidden"
            style={{ height: "2px", width: "48px", borderRadius: "9999px", background: "rgba(242,240,233,0.08)" }}
          >
            <div
              style={{
                height: "100%",
                width: `${ratio * 100}%`,
                background: ratio > 0.8 ? "#F5522A" : "#D6E800",
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>
        {!compact && (
          <span
            className="font-semibold flex items-center justify-center"
            style={{
              fontSize: "12px",
              height: "30px",
              padding: "0 12px",
              borderRadius: "9999px",
              background: full ? "rgba(242,240,233,0.05)" : "rgba(214,232,0,0.1)",
              border: `1px solid ${full ? "rgba(242,240,233,0.1)" : "rgba(214,232,0,0.25)"}`,
              color: full ? "rgba(242,240,233,0.35)" : "#D6E800",
            }}
          >
            {full ? "Full" : "Join"}
          </span>
        )}
      </div>
    </Link>
  );
}
