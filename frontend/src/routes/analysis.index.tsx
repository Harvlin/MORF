import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { UploadCloud, ChevronDown, Loader2, Play, Lock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { cn, getInitials } from "@/lib/utils";

export const Route = createFileRoute("/analysis/")({
  head: () => ({ meta: [{ title: "Movement Analysis — MORF" }] }),
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
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#6B5FC3" }}>
            AI-powered
          </p>
          <h1 className="text-[26px] font-black leading-tight" style={{ color: "#F2F0E9" }}>
            Movement analysis
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: "rgba(242,240,233,0.5)" }}>
            Upload a short video and get instant AI feedback on your technique.
          </p>
        </div>

        {/* Pick a movement */}
        <div className="card-frosted mb-5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold" style={{ color: "#F2F0E9" }}>Pick a movement</h2>
            <span
              className="text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: "rgba(242,240,233,0.35)" }}
            >
              Select one
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-3">
            {exercises.map((ex) => {
              const active = exercise === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => setExercise(ex.id)}
                  className="group relative rounded-2xl text-left transition-all p-4 min-w-[200px] sm:min-w-0"
                  style={{
                    background: active ? "rgba(214,232,0,0.1)" : "rgba(242,240,233,0.04)",
                    border: active ? "1px solid rgba(214,232,0,0.35)" : "1px solid rgba(242,240,233,0.07)",
                    boxShadow: active ? "0 0 20px rgba(214,232,0,0.1)" : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-xl grid place-items-center text-[11px] font-black transition-colors"
                        style={
                          active
                            ? { background: "#6B5FC3", color: "#F2F0E9" }
                            : { background: "rgba(242,240,233,0.07)", color: "rgba(242,240,233,0.5)" }
                        }
                      >
                        {getInitials(ex.label)}
                      </span>
                      <div className="font-bold text-[14px]" style={{ color: "#F2F0E9" }}>{ex.label}</div>
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors"
                      style={
                        active
                          ? { background: "#F5522A", color: "#F2F0E9" }
                          : { background: "rgba(242,240,233,0.06)", color: "rgba(242,240,233,0.35)" }
                      }
                    >
                      {active ? "✓" : "—"}
                    </span>
                  </div>
                  <div
                    className="mt-2.5 text-[11px] uppercase tracking-wider font-semibold"
                    style={{ color: active ? "rgba(214,232,0,0.6)" : "rgba(242,240,233,0.3)" }}
                  >
                    {ex.focus}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Locked exercises */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 mt-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:gap-3">
            {lockedExercises.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-2xl min-w-[160px] sm:min-w-0"
                style={{
                  background: "rgba(242,240,233,0.02)",
                  border: "1px solid rgba(242,240,233,0.05)",
                  opacity: 0.4,
                }}
              >
                <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(242,240,233,0.6)" }}>
                  <Lock size={11} /> Soon
                </div>
                <div className="font-bold text-[13px]" style={{ color: "#F2F0E9" }}>{ex.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload video */}
        <div className="card-frosted mb-4 p-5">
          <h2 className="text-sm font-bold mb-3" style={{ color: "#F2F0E9" }}>Upload video</h2>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-2xl border-2 border-dashed grid place-items-center transition-all text-center px-4 py-12"
            style={{
              borderColor: file ? "#6B5FC3" : "rgba(242,240,233,0.1)",
              background: file ? "rgba(107,95,195,0.05)" : "rgba(242,240,233,0.02)",
            }}
            onMouseEnter={(e) => {
              if (!file) {
                e.currentTarget.style.borderColor = "rgba(214,232,0,0.35)";
                e.currentTarget.style.background = "rgba(214,232,0,0.03)";
              }
            }}
            onMouseLeave={(e) => {
              if (!file) {
                e.currentTarget.style.borderColor = "rgba(242,240,233,0.1)";
                e.currentTarget.style.background = "rgba(242,240,233,0.02)";
              }
            }}
          >
            {file ? (
              <div>
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl grid place-items-center"
                  style={{ background: "#F5522A", color: "#F2F0E9" }}
                >
                  <Play size={18} fill="currentColor" />
                </div>
                <div className="font-semibold text-sm truncate max-w-xs" style={{ color: "#F2F0E9" }}>
                  {file.name}
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(242,240,233,0.4)" }}>
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ) : (
              <div>
                <UploadCloud
                  className="mx-auto mb-3"
                  size={36}
                  style={{ color: "rgba(242,240,233,0.25)" }}
                />
                <div className="font-semibold" style={{ color: "rgba(242,240,233,0.7)" }}>
                  Tap to choose video
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(242,240,233,0.35)" }}>
                  or drag and drop here
                </div>
              </div>
            )}
          </button>
          <div className="flex gap-2 mt-3 justify-center">
            {["MP4", "Max 30 sec", "50MB"].map((s) => (
              <span
                key={s}
                className="text-[10px] font-bold tracking-wide uppercase"
                style={{
                  background: "rgba(242,240,233,0.06)",
                  color: "rgba(242,240,233,0.4)",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(242,240,233,0.08)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Tips accordion */}
        <div className="card-frosted mb-6 overflow-hidden">
          <button
            onClick={() => setTipsOpen((o) => !o)}
            className="w-full flex items-center justify-between p-4 transition-colors"
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.03)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <span className="font-bold text-sm" style={{ color: "#F2F0E9" }}>Tips for best results</span>
            <ChevronDown
              size={15}
              className={cn("transition-transform", tipsOpen && "rotate-180")}
              style={{ color: "rgba(242,240,233,0.4)" }}
            />
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
                  <span
                    className="w-5 h-5 rounded-full grid place-items-center shrink-0 mt-0.5"
                    style={{ background: "rgba(245,82,42,0.1)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#F5522A" }} />
                  </span>
                  <span style={{ color: "rgba(242,240,233,0.6)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={cn(
            "w-full h-[52px] font-bold text-[15px] transition-all flex items-center justify-center gap-2 relative overflow-hidden"
          )}
          style={{
            borderRadius: "9999px",
            background: canAnalyze ? "#D6E800" : "rgba(242,240,233,0.05)",
            color: canAnalyze ? "#1C1C1A" : "rgba(242,240,233,0.2)",
            cursor: canAnalyze ? "pointer" : "not-allowed",
            boxShadow: canAnalyze ? "0 0 28px rgba(214,232,0,0.2)" : "none",
          }}
        >
          {progress !== null ? (
            <>
              <div
                className="absolute inset-0"
                style={{ background: "#D6E800", width: `${progress}%`, transition: "width 0.12s linear" }}
              />
              <span className="relative flex items-center gap-2" style={{ color: "#1C1C1A" }}>
                <Loader2 className="animate-spin" size={14} /> Analyzing... {progress}%
              </span>
            </>
          ) : (
            "Analyze my form"
          )}
        </button>
      </div>
    </AppShell>
  );
}
