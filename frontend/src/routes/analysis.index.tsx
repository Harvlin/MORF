import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { UploadCloud, ChevronDown, Loader2, Play, Lock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { cn, getInitials } from "@/lib/utils";

export const Route = createFileRoute("/analysis/")({
  head: () => ({ meta: [{ title: "Movement Analysis — Athena" }] }),
  component: AnalysisPage,
});

const exercises = [
  { id: "squat", label: "Squat", focus: "Lower body" },
  { id: "pushup", label: "Push-up", focus: "Upper body" },
  { id: "lunge", label: "Lunge", focus: "Balance" },
  { id: "plank", label: "Plank", focus: "Core stability" },
  { id: "deadlift", label: "Deadlift", focus: "Posterior chain" },
  { id: "overhead", label: "Overhead press", focus: "Shoulders" },
];
const lockedExercises = [
  { id: "pullup", label: "Pull-up" },
  { id: "burpee", label: "Burpee" },
  { id: "jump-rope", label: "Jump rope" },
  { id: "rowing", label: "Rowing" },
];

const tips = [
  "Full body visible in frame",
  "Good lighting (not backlit)",
  "Stable camera position",
  "Wear fitted clothing if possible",
];

function AnalysisPage() {
  const [exercise, setExercise] = useState<string>();
  const [file, setFile] = useState<File | null>(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleAnalyze = () => {
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p === null) return null;
        if (p >= 100) {
          clearInterval(id);
          navigate({ to: "/analysis/result" });
          return 100;
        }
        return p + 8;
      });
    }, 120);
  };

  const canAnalyze = exercise && file && progress === null;

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-5 lg:py-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">Movement analysis</h1>
          <p className="text-text-2 text-sm mt-1">
            Upload a short video and get instant AI feedback on your technique.
          </p>
        </div>

        <div className="mb-6 bg-surface border border-border rounded-3xl p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Pick a movement</h2>
            <span className="text-[10px] uppercase tracking-widest text-text-3">Select one</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-4">
            {exercises.map((ex) => {
              const active = exercise === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => setExercise(ex.id)}
                  className={cn(
                    "group relative rounded-2xl border text-left transition-all bg-surface p-4 min-w-[220px] sm:min-w-0",
                    active
                      ? "bg-primary-light border-primary shadow-[var(--shadow-soft)]"
                      : "border-border hover:border-border-strong hover:shadow-[var(--shadow-soft)]"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "w-9 h-9 rounded-xl border grid place-items-center text-[11px] font-semibold",
                          active
                            ? "bg-white text-primary border-primary/30"
                            : "bg-surface-3 text-text-2 border-border"
                        )}
                      >
                        {getInitials(ex.label)}
                      </span>
                      <div className="font-semibold text-sm">{ex.label}</div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-3 text-text-3"
                      )}
                    >
                      {active ? "Selected" : "Ready"}
                    </span>
                  </div>
                  <div className="mt-3 text-[11px] text-text-2 uppercase tracking-wider">
                    {ex.focus}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 mt-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:gap-3">
            {lockedExercises.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-2xl bg-surface-2 text-text-3 border border-dashed border-border-strong min-w-[200px] sm:min-w-0"
              >
                <div className="flex items-center gap-2 mb-2 text-[10px] font-semibold uppercase tracking-wider">
                  <Lock size={12} /> Coming soon
                </div>
                <div className="font-semibold text-sm">{ex.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 bg-surface border border-border rounded-3xl p-5">
          <h2 className="text-sm font-semibold mb-3">Upload video</h2>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className={cn(
              "w-full h-52 rounded-2xl border-2 border-dashed grid place-items-center transition-colors text-center px-4",
              file ? "border-primary bg-primary-light" : "border-border hover:border-text-3"
            )}
          >
            {file ? (
              <div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary text-primary-foreground grid place-items-center">
                  <Play size={16} />
                </div>
                <div className="font-semibold text-sm truncate max-w-xs">{file.name}</div>
                <div className="text-xs text-text-2 mt-1">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ) : (
              <div>
                <UploadCloud className="mx-auto mb-3 text-text-2" size={36} />
                <div className="font-semibold">Tap to choose video</div>
                <div className="text-xs text-text-2 mt-1">or drag and drop here</div>
              </div>
            )}
          </button>
          <div className="flex gap-2 mt-3 justify-center">
            {["MP4", "Max 30 sec", "50MB"].map((s) => (
              <span
                key={s}
                className="text-[10px] bg-surface-3 px-2.5 py-1 rounded-full font-medium tracking-wide text-text-2 uppercase"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6 bg-surface border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => setTipsOpen((o) => !o)}
            className="w-full flex items-center justify-between p-4 hover:bg-surface-3"
          >
            <span className="font-semibold text-sm">Tips for best results</span>
            <ChevronDown size={16} className={cn("transition-transform", tipsOpen && "rotate-180")} />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
              tipsOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="px-4 pb-4 space-y-3">
              {tips.map((t) => (
                <div key={t} className="flex items-start gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5" aria-hidden />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={cn(
            "w-full h-13 py-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden",
            canAnalyze ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]" : "bg-surface-3 text-text-3 cursor-not-allowed"
          )}
        >
          {progress !== null ? (
            <>
              <div className="absolute inset-0 bg-primary" style={{ width: `${progress}%`, transition: "width 0.12s linear" }} />
              <span className="relative flex items-center gap-2 text-primary-foreground"><Loader2 className="animate-spin" size={14} /> Analyzing... {progress}%</span>
            </>
          ) : "Analyze my form"}
        </button>
      </div>
    </AppShell>
  );
}
