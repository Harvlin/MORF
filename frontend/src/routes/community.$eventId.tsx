import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users, ChevronLeft } from "lucide-react";
import { events } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/community/$eventId")({
  component: EventDetail,
});



function EventDetail() {
  const { eventId } = Route.useParams();
  const event = events.find((e) => e.id === eventId) || events[0];
  const full = event.joined >= event.capacity;
  const ratio = Math.min(1, event.joined / event.capacity);
  const c = useColors();

  const avatarColors = [
    { bg: c.sunGlareBg, color: c.sunGlare },
    { bg: c.violetBg, color: c.violet },
    { bg: c.exuberantBg, color: c.exuberant },
    { bg: c.chipBg, color: c.textSecondary },
  ];

  return (
    <div
      className="min-h-dvh"
      style={{ background: c.appBg }}
    >
      {/* Hero area */}
      <div
        className="h-48 lg:h-64 flex items-end p-5 relative"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 30% 60%, ${c.sunGlareBg} 0%, transparent 70%), linear-gradient(175deg, ${c.isDark ? '#242420' : '#E6E3D8'} 0%, ${c.isDark ? '#1C1C1A' : '#F4F3EE'} 100%)`,
          borderBottom: `1px solid ${c.divider}`,
        }}
      >
        <Link
          to="/community"
          className="absolute top-4 left-4 w-10 h-10 grid place-items-center rounded-xl transition-colors"
          style={{
            background: c.chipBg,
            backdropFilter: "blur(12px)",
            border: `1px solid ${c.chipBorder}`,
            color: c.textSecondary,
          }}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="absolute right-6 top-1/2 -translate-y-1/2" aria-hidden>
          <div
            className="w-20 h-20 lg:w-24 lg:h-24 rounded-full font-black grid place-items-center"
            style={{
              background: c.sunGlareBg,
              color: c.sunGlare,
              fontSize: "24px",
              border: `2px solid ${c.sunGlare}33`,
              boxShadow: `0 0 40px ${c.sunGlareBg}`,
            }}
          >
            {getInitials(event.sport)}
          </div>
        </div>
        <div>
          <div
            className="text-xs uppercase tracking-widest font-bold mb-1"
            style={{ color: c.sunGlare }}
          >
            {event.sport}
          </div>
          <h1
            className="text-3xl font-black max-w-md"
            style={{ color: c.textPrimary }}
          >
            {event.title}
          </h1>
        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-2xl mx-auto pb-32">
        {/* Info rows */}
        <div className="space-y-2.5 mb-6">
          <Row icon={<Calendar size={15} />} label={`${event.date} · ${event.time}`} c={c} />
          <Row icon={<MapPin size={15} />} label={event.location} c={c} />
          <Row
            icon={<Users size={15} />}
            label={`${event.joined} of ${event.capacity} joined · hosted by ${event.host}`}
            c={c}
          />
        </div>

        {/* Capacity progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: c.textTertiary }}>
            <span>Capacity</span>
            <span>{Math.round(ratio * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: c.divider }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${ratio * 100}%`,
                background: ratio > 0.8 ? c.exuberant : c.sunGlare,
                boxShadow: ratio > 0.8 ? `0 0 8px ${c.exuberantBg}` : `0 0 8px ${c.sunGlareBg}`,
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {event.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: c.chipBg,
                color: c.textSecondary,
                border: `1px solid ${c.chipBorder}`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* About */}
        <div className="card-frosted p-5 mb-6">
          <h2 className="font-bold mb-2 text-sm uppercase tracking-widest" style={{ color: c.textTertiary }}>About</h2>
          <p className="text-sm leading-relaxed font-medium" style={{ color: c.textSecondary }}>
            {event.description}
          </p>
        </div>

        {/* Who's coming */}
        <div>
          <h2 className="font-bold mb-3" style={{ color: c.textPrimary }}>Who's coming</h2>
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(8, event.joined) }).map((_, i) => {
              const style = avatarColors[i % avatarColors.length];
              return (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full text-xs font-bold grid place-items-center"
                  style={{
                    background: style.bg,
                    color: style.color,
                    outline: `2px solid ${c.appBg}`,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              );
            })}
            {event.joined > 8 && (
              <div
                className="w-9 h-9 rounded-full text-xs font-bold grid place-items-center"
                style={{
                  background: c.chipBg,
                  color: c.textSecondary,
                  outline: `2px solid ${c.appBg}`,
                  border: `1px solid ${c.chipBorder}`,
                }}
              >
                +{event.joined - 8}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA bar */}
      <div
        className="fixed bottom-0 inset-x-0 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        style={{
          background: c.isDark ? "rgba(24,24,22,0.9)" : "rgba(244,243,238,0.9)",
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${c.divider}`,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <button
            disabled={full}
            className="w-full h-[52px] rounded-full font-bold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30"
            style={{
              background: full ? c.chipBg : c.sunGlare,
              color: full ? c.textTertiary : "#1C1C1A",
              border: full ? `1px solid ${c.chipBorder}` : "none",
              boxShadow: full ? "none" : `0 0 28px ${c.sunGlareBg}`,
            }}
          >
            {full ? "Event full" : "Join event"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, c }: { icon: React.ReactNode; label: string; c: ReturnType<typeof useColors> }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div
        className="w-8 h-8 rounded-lg grid place-items-center"
        style={{ background: c.chipBg, color: c.textSecondary }}
      >
        {icon}
      </div>
      <span className="font-medium" style={{ color: c.textSecondary }}>{label}</span>
    </div>
  );
}
