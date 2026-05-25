import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { nudgeHistory } from "@/lib/mock-data";

export const Route = createFileRoute("/profile/nudges")({
  component: NudgesPage,
});

function NudgesPage() {
  return (
    <div className="app-stage min-h-dvh text-foreground">
      <PageHeader title="Nudge history" back="/profile" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto pb-12 space-y-2">
        {nudgeHistory.map((n) => (
          <div
            key={n.id}
            className="bg-surface border border-border rounded-2xl p-4 flex items-start gap-3"
          >
            <div
              className={`w-8 h-8 rounded-full grid place-items-center shrink-0 ${n.actedOn ? "bg-secondary-light text-secondary" : "bg-surface-3 text-text-3"}`}
            >
              {n.actedOn ? <Check size={14} strokeWidth={3} /> : <X size={14} />}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{n.headline}</div>
              <div className="text-xs text-text-2 mt-0.5">{n.message}</div>
              <div className="text-[10px] text-text-3 mt-2 uppercase tracking-wider">
                {n.ts} · {n.actedOn ? "Acted on" : "Dismissed"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
