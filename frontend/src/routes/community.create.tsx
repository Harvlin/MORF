import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2, Minus, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/community/create")({
  component: CreateEvent,
});

const sports = ["Badminton", "Running", "Yoga", "Cycling", "Swimming", "Football"];
const tagOptions = ["beginner-friendly", "women-only", "adaptive access", "free", "casual"];

function CreateEvent() {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("Badminton");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [cap, setCap] = useState(10);
  const [tags, setTags] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();
  const c = useColors();

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setDesc(
        `A ${tags.includes("beginner-friendly") ? "beginner-friendly " : ""}${sport.toLowerCase()} session at ${location || "a comfortable venue"}. ${tags.includes("women-only") ? "Women only. " : ""}${tags.includes("adaptive access") ? "Adaptive access for all abilities. " : ""}${tags.includes("casual") ? "Casual and relaxed vibes" : "Friendly atmosphere"} — come solo or bring a friend.`,
      );
      setGenerating(false);
    }, 1200);
  };

  const inputStyle = {
    width: "100%",
    background: c.inputBg,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${c.inputBorder}`,
    borderRadius: "14px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 500,
    outline: "none",
    color: c.textPrimary,
  };

  return (
    <AppShell>
      <PageHeader title="Create event" back="/community" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto pb-12 space-y-6">
        <Section label="Basics" c={c}>
          <Field label="Event name" c={c}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Saturday Morning Run"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
              onBlur={e => (e.currentTarget.style.borderColor = c.inputBorder)}
            />
          </Field>
          <Field label="Sport" c={c}>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}
              onFocus={e => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
              onBlur={e => (e.currentTarget.style.borderColor = c.inputBorder)}
            >
              {sports.map((s) => <option key={s} style={{ background: c.appBg }}>{s}</option>)}
            </select>
          </Field>
          <Field label="Date & time" c={c}>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: c.isDark ? "dark" : "light" }}
              onFocus={e => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
              onBlur={e => (e.currentTarget.style.borderColor = c.inputBorder)}
            />
          </Field>
          <Field label="Location" c={c}>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="GBK, Jakarta"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
              onBlur={e => (e.currentTarget.style.borderColor = c.inputBorder)}
            />
          </Field>
          <Field label="Max participants" c={c}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCap(Math.max(2, cap - 1))}
                className="w-11 h-11 rounded-xl grid place-items-center transition-all active:scale-90"
                style={{
                  background: c.chipBg,
                  border: `1px solid ${c.chipBorder}`,
                  color: c.textSecondary,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = c.chipBg)}
              >
                <Minus size={14} />
              </button>
              <div className="flex-1 text-center text-[24px] font-black tabular" style={{ color: c.textPrimary }}>
                {cap}
              </div>
              <button
                onClick={() => setCap(cap + 1)}
                className="w-11 h-11 rounded-xl grid place-items-center transition-all active:scale-90"
                style={{
                  background: c.chipBg,
                  border: `1px solid ${c.chipBorder}`,
                  color: c.textSecondary,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = c.chipBg)}
              >
                <Plus size={14} />
              </button>
            </div>
          </Field>
        </Section>

        <Section label="Inclusivity tags" c={c}>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((t) => {
              const active = tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => setTags(active ? tags.filter((x) => x !== t) : [...tags, t])}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95"
                  style={
                    active
                      ? { background: c.sunGlare, color: "#1C1C1A", border: "none" }
                      : {
                          background: c.chipBg,
                          border: `1px solid ${c.chipBorder}`,
                          color: c.textSecondary,
                        }
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Description" c={c}>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={5}
            placeholder="What can attendees expect?"
            style={{ ...inputStyle, resize: "none" }}
            onFocus={e => (e.currentTarget.style.borderColor = `${c.sunGlare}66`)}
            onBlur={e => (e.currentTarget.style.borderColor = c.inputBorder)}
          />
          <button
            onClick={generate}
            disabled={generating}
            className="mt-2 inline-flex items-center gap-2 text-sm font-bold transition-colors disabled:opacity-50"
            style={{ color: c.violet }}
            onMouseEnter={e => (e.currentTarget.style.color = c.violetLight)}
            onMouseLeave={e => (e.currentTarget.style.color = c.violet)}
          >
            {generating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            {generating ? "Generating..." : "Generate with AI"}
          </button>
        </Section>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => navigate({ to: "/community" })}
            disabled={!name || !date || !location}
            className="w-full h-[52px] rounded-full font-bold text-[15px] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
            style={{ background: c.sunGlare, color: "#1C1C1A", boxShadow: `0 0 24px ${c.sunGlareBg}` }}
          >
            Publish event
          </button>
          <button
            className="w-full text-center text-sm font-semibold transition-opacity hover:opacity-100"
            style={{ color: c.textTertiary }}
          >
            Save as draft
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ label, children, c }: { label: string; children: React.ReactNode; c: ReturnType<typeof useColors> }) {
  return (
    <div>
      <h2
        className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ color: c.textTertiary }}
      >
        {label}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children, c }: { label: string; children: React.ReactNode; c: ReturnType<typeof useColors> }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: c.textSecondary }}>
        {label}
      </label>
      {children}
    </div>
  );
}
