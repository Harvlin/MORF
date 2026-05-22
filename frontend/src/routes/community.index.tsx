import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EventCard } from "@/components/EventCard";
import { EmptyState, CrowdIllustration } from "@/components/EmptyState";
import { events } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community/")({
  head: () => ({ meta: [{ title: "Community — MORF" }] }),
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
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#6B5FC3" }}>
              Discover
            </p>
            <h1 className="text-[26px] font-black" style={{ color: "#F2F0E9" }}>Community</h1>
          </div>
          <Link
            to="/community/create"
            className="hidden lg:flex items-center gap-2 text-sm font-bold hover:opacity-90 transition-all"
            style={{
              background: "#F5522A",
              color: "#F2F0E9",
              height: "40px",
              padding: "0 18px",
              borderRadius: "9999px",
              boxShadow: "0 0 20px rgba(245,82,42,0.2)",
            }}
          >
            <Plus size={15} /> Create event
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2"
            size={15}
            style={{ color: "rgba(242,240,233,0.35)" }}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events, places..."
            className="w-full pl-11 pr-4 text-sm focus:outline-none"
            style={{
              background: "rgba(242,240,233,0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(242,240,233,0.1)",
              borderRadius: "9999px",
              height: "48px",
              color: "#F2F0E9",
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = "rgba(107,95,195,0.4)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(107,95,195,0.06)";
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = "rgba(242,240,233,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 -mx-4 px-4 lg:mx-0 lg:px-0 pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 px-4 h-9 rounded-full text-[13px] font-semibold transition-all active:scale-95",
              )}
              style={
                filter === f
                  ? {
                      background: "#6B5FC3",
                      color: "#F2F0E9",
                      boxShadow: "0 0 16px rgba(107,95,195,0.3)",
                    }
                  : {
                      background: "rgba(242,240,233,0.05)",
                      color: "rgba(242,240,233,0.55)",
                      border: "1px solid rgba(242,240,233,0.08)",
                    }
              }
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
                className="font-bold h-10 px-5 rounded-full text-sm flex items-center hover:opacity-90 transition-all"
                style={{ background: "#F5522A", color: "#F2F0E9", boxShadow: "0 0 16px rgba(245,82,42,0.3)" }}
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
        style={{
          background: "#F5522A",
          color: "#F2F0E9",
          boxShadow: "0 4px 24px rgba(245,82,42,0.4)",
        }}
      >
        <Plus size={22} strokeWidth={2.5} />
      </Link>
    </AppShell>
  );
}
