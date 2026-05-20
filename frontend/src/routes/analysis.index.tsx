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
          <h1 className="text-[24px] font-bold text-[var(--foreground)] leading-tight">Movement analysis</h1>
          <p className="text-[var(--foreground)] opacity-80 text-sm mt-1 font-medium">
            Upload a short video and get instant AI feedback on your technique.
          </p>
        </div>

        <div className="card-frosted mb-6 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Pick a movement</h2>
            <span className="text-[10px] uppercase tracking-widest text-[var(--foreground)] opacity-60">Select one</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-4">
            {exercises.map((ex) => {
              const active = exercise === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => setExercise(ex.id)}
                  className={cn(
                    "group relative rounded-2xl text-left transition-all p-4 min-w-[220px] sm:min-w-0 border",
                    active
                      ? "bg-[rgba(255,255,255,0.7)] border-[#1a3d35] shadow-md"
                      : "bg-[rgba(255,255,255,0.4)] border-white shadow-sm hover:bg-[rgba(255,255,255,0.6)]"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "w-9 h-9 rounded-xl grid place-items-center text-[11px] font-bold shadow-sm transition-colors",
                          active
                            ? "bg-[#1a3d35] text-white"
                            : "bg-white text-[#1a3d35]"
                        )}
                      >
                        {getInitials(ex.label)}
                      </span>
                      <div className="font-bold text-sm text-[var(--foreground)]">{ex.label}</div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors",
                        active ? "bg-[#1a3d35] text-white" : "bg-[rgba(26,61,53,0.15)] text-[#1a3d35]"
                      )}
                    >
                      {active ? "Selected" : "Ready"}
                    </span>
                  </div>
                  <div className="mt-3 text-[11px] uppercase tracking-wider text-[#0f2420] opacity-60" >
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
                className="p-4 rounded-2xl min-w-[200px] sm:min-w-0 bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.4)] text-[var(--foreground)] opacity-60"
              >
                <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider">
                  <Lock size={12} /> Coming soon
                </div>
                <div className="font-bold text-sm">{ex.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-frosted mb-4 p-5">
          <h2 className="text-sm font-semibold mb-3 text-[var(--foreground)]">Upload video</h2>
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
              "w-full rounded-2xl border-2 border-dashed grid place-items-center transition-colors text-center px-4 py-12"
            )}
            style={{
              borderColor: file ? "#1a3d35" : "rgba(255,255,255,0.8)",
              background: file ? "rgba(26,61,53,0.1)" : "rgba(255,255,255,0.45)",
              borderRadius: "16px",
            }}
            onMouseEnter={(e) => { if (!file) { e.currentTarget.style.borderColor = "#1a3d35"; e.currentTarget.style.background = "rgba(255,255,255,0.7)"; }}}
            onMouseLeave={(e) => { if (!file) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)"; e.currentTarget.style.background = "rgba(255,255,255,0.45)"; }}}
          >
            {file ? (
              <div>
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl grid place-items-center"
                  style={{ background: "#1a3d35", color: "#ffffff" }}
                >
                  <Play size={16} />
                </div>
                <div className="font-semibold text-sm truncate max-w-xs">{file.name}</div>
                <div className="text-xs text-text-2 mt-1">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ) : (
              <div>
                <UploadCloud className="mx-auto mb-3 text-[var(--foreground)] opacity-50" size={36}  />
                <div className="font-semibold text-[var(--foreground)]">Tap to choose video</div>
                <div className="text-xs text-[var(--foreground)] opacity-60 mt-1">or drag and drop here</div>
              </div>
            )}
          </button>
          <div className="flex gap-2 mt-3 justify-center">
            {["MP4", "Max 30 sec", "50MB"].map((s) => (
              <span
                key={s}
                className="text-[10px] font-bold tracking-wide uppercase"
                style={{ background: "rgba(26,61,53,0.1)", color: "#1a3d35", padding: "4px 10px", borderRadius: "9999px" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="card-frosted mb-6 overflow-hidden">
          <button
            onClick={() => setTipsOpen((o) => !o)}
            className="w-full flex items-center justify-between p-4 hover:bg-[rgba(255,255,255,0.4)]"
          >
            <span className="font-semibold text-sm text-[var(--foreground)]">Tips for best results</span>
            <ChevronDown size={16} className={cn("transition-transform text-[var(--foreground)]", tipsOpen && "rotate-180")} />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
              tipsOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="px-4 pb-4 space-y-3">
              {tips.map((t) => (
                <div key={t} className="flex items-start gap-3 text-sm text-[var(--foreground)]">
                  <span className="w-2 h-2 rounded-full bg-[#1a3d35] mt-1.5" aria-hidden />
                  <span className="opacity-80">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={cn(
            "w-full h-[52px] font-semibold text-[15px] transition-all flex items-center justify-center gap-2 relative overflow-hidden"
          )}
          style={{
            borderRadius: "9999px",
            fontWeight: 700,
            background: canAnalyze ? "#1a3d35" : "#e2ece7",
            color: canAnalyze ? "#ffffff" : "#8aada5",
            cursor: canAnalyze ? "pointer" : "not-allowed",
          }}
        >
          {progress !== null ? (
            <>
              <div
                className="absolute inset-0"
                style={{ background: "#1a3d35", width: `${progress}%`, transition: "width 0.12s linear" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "rgba(255,255,255,0.2)", width: `${progress}%`, transition: "width 0.12s linear", mixBlendMode: "overlay" }}
              />
              <span className="relative flex items-center gap-2 text-white" ><Loader2 className="animate-spin" size={14} /> Analyzing... {progress}%</span>
            </>
          ) : "Analyze my form"}
        </button>
      </div>
    </AppShell>
  );
}
