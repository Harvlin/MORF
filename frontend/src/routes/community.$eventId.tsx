import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users, ChevronLeft } from "lucide-react";
import { events } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

export const Route = createFileRoute("/community/$eventId")({
  component: EventDetail,
});

function EventDetail() {
  const { eventId } = Route.useParams();
  const event = events.find((e) => e.id === eventId) || events[0];
  const full = event.joined >= event.capacity;

  return (
    <div className="min-h-dvh">
      <div className="h-48 lg:h-64 flex items-end p-5 relative" style={{ background: "rgba(255,255,255,0.2)" }}>
        <Link
          to="/community"
          className="absolute top-4 left-4 w-10 h-10 grid place-items-center rounded-lg bg-[rgba(255,255,255,0.45)] backdrop-blur text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.6)] transition-colors"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="absolute right-6 top-1/2 -translate-y-1/2" aria-hidden>
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[rgba(255,255,255,0.7)] shadow-lg text-xl lg:text-[24px] font-bold text-[#1a3d35] grid place-items-center">
            {getInitials(event.sport)}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-[#1a3d35] opacity-80 font-bold">
            {event.sport}
          </div>
          <h1 className="text-3xl font-bold mt-1 max-w-md text-[var(--foreground)]">{event.title}</h1>
        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-2xl mx-auto pb-32">
        <div className="space-y-3 mb-6">
          <Row icon={<Calendar size={16} />} label={`${event.date} · ${event.time}`} />
          <Row icon={<MapPin size={16} />} label={event.location} />
          <Row
            icon={<Users size={16} />}
            label={`${event.joined} of ${event.capacity} joined · hosted by ${event.host}`}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6 mt-6">
          {event.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-semibold bg-[rgba(26,61,53,0.1)] text-[#1a3d35] px-3 py-1.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        <div>
          <h2 className="font-semibold mb-2 text-[var(--foreground)]">About</h2>
          <p className="text-sm text-[var(--foreground)] opacity-80 leading-relaxed font-medium">{event.description}</p>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold mb-3 text-[var(--foreground)]">Who's coming</h2>
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(8, event.joined) }).map((_, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.7)] shadow border border-white text-xs font-bold text-[#1a3d35] grid place-items-center"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {event.joined > 8 && (
              <div className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.4)] shadow border border-white text-xs font-bold grid place-items-center text-[#1a3d35]">
                +{event.joined - 8}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-[rgba(255,255,255,0.6)] backdrop-blur-md border-t border-[rgba(255,255,255,0.3)] px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto">
          <button
            disabled={full}
            className="w-full h-[52px] rounded-full bg-[#1a3d35] text-white font-bold disabled:opacity-50 hover:opacity-90 active:scale-[0.98] shadow-lg transition-all"
          >
            {full ? "Event full" : "Join event"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[var(--foreground)]">
      <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.4)] grid place-items-center text-[#1a3d35]">
        {icon}
      </div>
      <span className="font-semibold">{label}</span>
    </div>
  );
}
