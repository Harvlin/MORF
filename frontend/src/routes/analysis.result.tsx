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
  const grade = result.score >= 80 ? "Excellent form" : result.score >= 60 ? "Good progress" : result.score >= 40 ? "Keep practicing" : "Let's improve together";
  const delta = result.prevScore ? result.score - result.prevScore : null;

  return (
    <AppShell>
      <PageHeader title="Movement analysis" back="/analysis" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto pb-12">
        <div className="flex flex-col items-center text-center mb-6">
          <CircularScore value={result.score} label="Movement Score" />
          <div className="text-[24px] font-bold text-[var(--foreground)] mt-5">{grade}</div>
          <div className="text-xs text-[var(--foreground)] opacity-80 mt-1.5 uppercase tracking-wider font-semibold">{result.exercise} · {new Date(result.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</div>

          {delta !== null && (
            <div className="mt-4 inline-flex items-center gap-2 bg-[rgba(244,124,60,0.2)] text-[#f47c3c] text-xs font-bold px-3 py-1.5 rounded-full">
              <ArrowUp size={12} /> +{delta} vs last week
            </div>
          )}
        </div>

        <div className="card-frosted p-5 mb-4">
          <h2 className="font-semibold text-sm mb-4">Breakdown</h2>
          <div className="space-y-4">
            {result.metrics.map((m) => (
              <div key={m.label} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg grid place-items-center shrink-0 font-bold ${m.status === "good" ? "bg-[rgba(244,124,60,0.15)] text-[#f47c3c]" : "bg-[rgba(26,61,53,0.1)] text-[#1a3d35]"}`}>
                  {m.status === "good" ? <Check size={14} strokeWidth={3} /> : <ArrowUp size={14} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3 text-[var(--foreground)]">
                    <div className="font-semibold text-sm">{m.label}</div>
                    <div className="font-bold text-sm tabular">{m.value}</div>
                  </div>
                  <div className="text-xs text-[var(--foreground)] opacity-70 mt-0.5">{m.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-frosted p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#1a3d35] text-white grid place-items-center text-xs font-semibold">A</div>
            <span className="font-semibold text-sm text-[var(--foreground)]">Your coach says</span>
          </div>
          <FormattedText text={result.feedback} />
        </div>

        <div className="card-frosted !bg-[rgba(244,124,60,0.1)] !border-[rgba(244,124,60,0.3)] p-5 mb-6 text-[var(--foreground)]">
          <div className="text-xs uppercase tracking-widest text-[#f47c3c] font-bold mb-2 flex items-center gap-1.5">
            <TrendingUp size={12} strokeWidth={3} /> Try this drill
          </div>
          <h3 className="text-xl font-bold mb-1 text-[var(--foreground)]">{result.drill.name}</h3>
          <p className="text-sm text-[var(--foreground)] opacity-80 mb-4 font-medium">{result.drill.description}</p>
          <button className="bg-[#f47c3c] text-white h-[44px] px-5 rounded-full text-sm font-bold hover:opacity-90 active:scale-[0.98] shadow-lg transition-all">
            Add to my plan
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/analysis" className="h-[52px] rounded-full bg-white text-[#1a3d35] font-bold text-[15px] grid place-items-center hover:opacity-90 active:scale-[0.98] shadow-lg transition-all">
            Analyze another
          </Link>
          <Link to="/coach" className="h-[52px] rounded-full bg-primary text-white font-bold text-[15px] grid place-items-center hover:opacity-90 active:scale-[0.98] transition-all">
            Go to my plan
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
