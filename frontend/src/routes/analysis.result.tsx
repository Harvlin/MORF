import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowUp, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { CircularScore } from "@/components/CircularScore";
import { FormattedText } from "@/components/FormattedText";
import { analyses } from "@/lib/mock-data";

export const Route = createFileRoute("/analysis/result")({
  component: ResultPage,
});

function ResultPage() {
  const result = analyses[0];
  const grade =
    result.score >= 80
      ? "Excellent form"
      : result.score >= 60
        ? "Good progress"
        : result.score >= 40
          ? "Keep practicing"
          : "Let's improve together";
  const delta = result.prevScore ? result.score - result.prevScore : null;

  return (
    <AppShell>
      <PageHeader title="Movement analysis" back="/analysis" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto pb-12">
        <div className="flex flex-col items-center text-center mb-6">
          <CircularScore value={result.score} label="Movement Score" />
          <div
            className="text-[24px] font-black mt-5"
            style={{ color: "#F2F0E9" }}
          >
            {grade}
          </div>
          <div
            className="text-xs mt-1.5 uppercase tracking-wider font-semibold"
            style={{ color: "rgba(242,240,233,0.4)" }}
          >
            {result.exercise} ·{" "}
            {new Date(result.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </div>

          {delta !== null && (
            <div
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(107,95,195,0.12)", color: "#6B5FC3", border: "1px solid rgba(107,95,195,0.2)" }}
            >
              <ArrowUp size={12} /> +{delta} vs last week
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="card-frosted p-5 mb-4">
          <h2 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "rgba(242,240,233,0.4)" }}>
            Breakdown
          </h2>
          <div className="space-y-4">
            {result.metrics.map((m) => (
              <div key={m.label} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-lg grid place-items-center shrink-0 font-bold"
                  style={
                    m.status === "good"
                      ? { background: "rgba(107,95,195,0.12)", color: "#6B5FC3" }
                      : { background: "rgba(245,82,42,0.12)", color: "#F5522A" }
                  }
                >
                  {m.status === "good" ? <Check size={14} strokeWidth={3} /> : <ArrowUp size={14} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-semibold text-sm" style={{ color: "#F2F0E9" }}>{m.label}</div>
                    <div className="font-bold text-sm tabular" style={{ color: "rgba(242,240,233,0.7)" }}>{m.value}</div>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(242,240,233,0.45)" }}>{m.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coach feedback */}
        <div className="card-frosted p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-full grid place-items-center text-xs font-black"
              style={{ background: "#6B5FC3", color: "#F2F0E9" }}
            >
              M
            </div>
            <span className="font-bold text-sm" style={{ color: "#F2F0E9" }}>Your coach says</span>
          </div>
          <FormattedText text={result.feedback} />
        </div>

        {/* Drill */}
        <div
          className="card-frosted p-5 mb-6"
          style={{ borderColor: "rgba(245,82,42,0.2)", background: "rgba(245,82,42,0.05)" }}
        >
          <div
            className="text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"
            style={{ color: "#F5522A" }}
          >
            <TrendingUp size={12} strokeWidth={3} /> Try this drill
          </div>
          <h3 className="text-xl font-black mb-1" style={{ color: "#F2F0E9" }}>
            {result.drill.name}
          </h3>
          <p className="text-sm font-medium mb-4" style={{ color: "rgba(242,240,233,0.6)" }}>
            {result.drill.description}
          </p>
          <button
            className="h-11 px-5 rounded-full text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: "#F5522A", color: "#F2F0E9", boxShadow: "0 4px 16px rgba(245,82,42,0.3)" }}
          >
            Add to my plan
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/analysis"
            className="h-[52px] rounded-full font-bold text-[15px] grid place-items-center transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "rgba(242,240,233,0.08)",
              border: "1px solid rgba(242,240,233,0.12)",
              color: "#F2F0E9",
            }}
          >
            Analyze another
          </Link>
          <Link
            to="/coach"
            className="h-[52px] rounded-full font-bold text-[15px] grid place-items-center hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: "#D6E800", color: "#1C1C1A", boxShadow: "0 0 24px rgba(214,232,0,0.2)" }}
          >
            Go to my plan
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
