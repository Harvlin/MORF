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
    <div className="min-h-dvh bg-background">
      <div className="bg-primary-light h-48 lg:h-64 flex items-end p-5 relative">
        <Link
          to="/community"
          className="absolute top-4 left-4 w-10 h-10 grid place-items-center rounded-lg bg-surface/80 backdrop-blur"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="absolute right-6 top-1/2 -translate-y-1/2" aria-hidden>
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-surface/80 border border-border text-xl lg:text-2xl font-semibold grid place-items-center text-text-2">
            {getInitials(event.sport)}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">
            {event.sport}
          </div>
          <h1 className="text-3xl font-semibold mt-1 max-w-md">{event.title}</h1>
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

        <div className="flex flex-wrap gap-2 mb-6">
          {event.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-medium bg-secondary-light text-secondary px-3 py-1.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        <div>
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-sm text-text-2 leading-relaxed">{event.description}</p>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold mb-3">Who's coming</h2>
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(8, event.joined) }).map((_, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-surface-3 border-2 border-surface text-xs font-semibold grid place-items-center"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {event.joined > 8 && (
              <div className="w-9 h-9 rounded-full bg-surface-3 border-2 border-surface text-xs font-medium grid place-items-center text-text-2">
                +{event.joined - 8}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 border-t border-border bg-surface/95 backdrop-blur px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto">
          <button
            disabled={full}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:bg-surface-3 disabled:text-text-3 hover:opacity-90 active:scale-[0.98] transition-all"
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
    <div className="flex items-center gap-3 text-sm">
      <div className="w-8 h-8 rounded-lg bg-surface-3 grid place-items-center text-text-2">
        {icon}
      </div>
      {label}
    </div>
  );
}
