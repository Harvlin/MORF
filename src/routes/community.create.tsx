import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2, Minus, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
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
        `Sesi ${sport.toLowerCase()} ${tags.includes("beginner-friendly") ? "ramah pemula " : ""}di ${location || "lokasi yang nyaman"}. ${tags.includes("women-only") ? "Khusus untuk perempuan, " : ""}${tags.includes("adaptive access") ? "dengan akses adaptif untuk semua kemampuan, " : ""}suasana ${tags.includes("casual") ? "santai" : "ramah"} — datang sendiri atau ajak teman. Tidak ada tekanan, hanya gerak bersama.`,
      );
      setGenerating(false);
    }, 1200);
  };

  return (
    <div className="min-h-dvh bg-background">
      <PageHeader title="Create event" back="/community" />
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto pb-12 space-y-6">
        <Section label="Basics">
          <Field label="Event name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Saturday Morning Run"
              className="input"
            />
          </Field>
          <Field label="Sport">
            <select value={sport} onChange={(e) => setSport(e.target.value)} className="input">
              {sports.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Date & time">
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Location">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="GBK, Jakarta"
              className="input"
            />
          </Field>
          <Field label="Max participants">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCap(Math.max(2, cap - 1))}
                className="w-11 h-11 rounded-xl border border-border grid place-items-center hover:bg-surface-3 active:scale-90"
              >
                <Minus size={14} />
              </button>
              <div className="flex-1 text-center text-2xl font-semibold tabular">{cap}</div>
              <button
                onClick={() => setCap(cap + 1)}
                className="w-11 h-11 rounded-xl border border-border grid place-items-center hover:bg-surface-3 active:scale-90"
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
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border-2 transition-all active:scale-95",
                    active
                      ? "bg-primary-light border-primary text-primary"
                      : "bg-surface border-border",
                  )}
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
            className="input resize-none"
          />
          <button
            onClick={generate}
            disabled={generating}
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline disabled:opacity-50"
          >
            {generating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            {generating ? "Generating..." : "Generate with AI"}
          </button>
        </Section>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => navigate({ to: "/community" })}
            disabled={!name || !date || !location}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:bg-surface-3 disabled:text-text-3 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Publish event
          </button>
          <button className="w-full text-center text-sm text-text-2 hover:text-text-1">
            Save as draft
          </button>
        </div>
      </div>
      <style>{`.input{width:100%;background:var(--color-surface);border:1px solid var(--color-border);border-radius:12px;padding:12px 16px;font-size:14px;outline:none}.input:focus{border-color:var(--color-primary)}`}</style>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-widest text-text-2 mb-3">{label}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}
