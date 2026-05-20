import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EventCard } from "@/components/EventCard";
import { EmptyState, CrowdIllustration } from "@/components/EmptyState";
import { events } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community/")({
  head: () => ({ meta: [{ title: "Community — Athena" }] }),
  component: CommunityPage,
});

const filters = ["All", "Beginner-friendly", "Women only", "Free", "Adaptive access", "Casual"];

function CommunityPage() {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const filtered = events.filter((e) => {
    const matchQ =
      !q ||
      e.title.toLowerCase().includes(q.toLowerCase()) ||
      e.location.toLowerCase().includes(q.toLowerCase());
    const matchF =
      filter === "All" ||
      e.tags.some((t) => t.toLowerCase().includes(filter.toLowerCase().replace(" only", "-only")));
    return matchQ && matchF;
  });

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-[24px] font-bold text-text-1" style={{ color: "var(--foreground)" }}>Community</h1>
          <Link
            to="/community/create"
            className="hidden lg:flex items-center gap-2 text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "#1a3d35", color: "#ffffff", height: "40px", padding: "0 18px", borderRadius: "9999px" }}
          >
            <Plus size={16} /> Create event
          </Link>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events, places..."
            className="w-full pl-11 pr-4 text-sm focus:outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.45)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              borderRadius: "9999px",
              height: "48px",
              boxShadow: "var(--shadow-glass)",
              color: "var(--color-text-dark)",
            }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 -mx-4 px-4 lg:mx-0 lg:px-0 pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 px-4 h-9 rounded-full text-sm font-medium transition-all active:scale-95",
              )}
              style={filter === f
                ? { background: "#1a3d35", color: "#ffffff" }
                : { background: "rgba(255,255,255,0.2)", color: "var(--foreground)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<CrowdIllustration />}
            title="No events match"
            description="Try a different filter or be the first to create one."
            action={
              <Link
                to="/community/create"
                className="bg-primary text-primary-foreground h-10 px-4 rounded-lg text-sm font-semibold flex items-center hover:opacity-90 transition-all"
              >
                Create event
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>

      <Link
        to="/community/create"
        className="lg:hidden fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full grid place-items-center hover:opacity-90 active:scale-90 transition-all"
        aria-label="Create event"
        style={{ background: "#1a3d35", color: "#ffffff", boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}
      >
        <Plus size={22} strokeWidth={2.5} />
      </Link>
    </AppShell>
  );
}
