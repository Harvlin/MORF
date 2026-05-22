import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2, Minus, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

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
    background: "rgba(242,240,233,0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(242,240,233,0.1)",
    borderRadius: "14px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 500,
    outline: "none",
    color: "#F2F0E9",
  };

  return (
    <AppShell>
      <PageHeader title="Create event" back="/community" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto pb-12 space-y-6">
        <Section label="Basics">
          <Field label="Event name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Saturday Morning Run"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(214,232,0,0.4)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(242,240,233,0.1)")}
            />
          </Field>
          <Field label="Sport">
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(214,232,0,0.4)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(242,240,233,0.1)")}
            >
              {sports.map((s) => <option key={s} style={{ background: "#1E1E1B" }}>{s}</option>)}
            </select>
          </Field>
          <Field label="Date & time">
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(214,232,0,0.4)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(242,240,233,0.1)")}
            />
          </Field>
          <Field label="Location">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="GBK, Jakarta"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(214,232,0,0.4)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(242,240,233,0.1)")}
            />
          </Field>
          <Field label="Max participants">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCap(Math.max(2, cap - 1))}
                className="w-11 h-11 rounded-xl grid place-items-center transition-all active:scale-90"
                style={{
                  background: "rgba(242,240,233,0.06)",
                  border: "1px solid rgba(242,240,233,0.1)",
                  color: "rgba(242,240,233,0.6)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(242,240,233,0.06)")}
              >
                <Minus size={14} />
              </button>
              <div className="flex-1 text-center text-[24px] font-black tabular" style={{ color: "#F2F0E9" }}>
                {cap}
              </div>
              <button
                onClick={() => setCap(cap + 1)}
                className="w-11 h-11 rounded-xl grid place-items-center transition-all active:scale-90"
                style={{
                  background: "rgba(242,240,233,0.06)",
                  border: "1px solid rgba(242,240,233,0.1)",
                  color: "rgba(242,240,233,0.6)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(242,240,233,0.06)")}
              >
                <Plus size={14} />
              </button>
            </div>
          </Field>
        </Section>

        <Section label="Inclusivity tags">
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
                      ? { background: "#D6E800", color: "#1C1C1A", border: "none" }
                      : {
                          background: "rgba(242,240,233,0.05)",
                          border: "1px solid rgba(242,240,233,0.1)",
                          color: "rgba(242,240,233,0.6)",
                        }
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Description">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={5}
            placeholder="What can attendees expect?"
            style={{ ...inputStyle, resize: "none" }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(214,232,0,0.4)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(242,240,233,0.1)")}
          />
          <button
            onClick={generate}
            disabled={generating}
            className="mt-2 inline-flex items-center gap-2 text-sm font-bold transition-colors disabled:opacity-50"
            style={{ color: "#6B5FC3" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#8B80D4")}
            onMouseLeave={e => (e.currentTarget.style.color = "#6B5FC3")}
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
            style={{ background: "#D6E800", color: "#1C1C1A", boxShadow: "0 0 24px rgba(214,232,0,0.2)" }}
          >
            Publish event
          </button>
          <button
            className="w-full text-center text-sm font-semibold transition-opacity hover:opacity-100"
            style={{ color: "rgba(242,240,233,0.4)" }}
          >
            Save as draft
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ color: "rgba(242,240,233,0.35)" }}
      >
        {label}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgba(242,240,233,0.55)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
