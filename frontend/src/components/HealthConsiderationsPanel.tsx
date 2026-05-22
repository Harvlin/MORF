import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ShieldAlert, ChevronDown, CheckCircle, AlertTriangle } from "lucide-react";
import { useApp } from "@/lib/store";

function buildRecs(conditions: ReturnType<typeof useApp.getState>["healthProfile"]["conditions"]) {
  const recs: string[] = [];
  const cautions: string[] = [];
  for (const c of conditions) {
    if (c.type === "Joint issues") {
      const joints = (c.details.joints as string[]) ?? [];
      const j = joints.join(" / ").toLowerCase() || "joints";
      recs.push(`Low-impact exercises like swimming or cycling are gentle on your ${j}.`);
      recs.push("Focus on hip hinge patterns with controlled range of motion.");
      if (joints.includes("Knee"))
        cautions.push("Avoid deep squats past 90° given your knee condition.");
      cautions.push("Skip explosive jumping movements for now.");
    } else if (c.type === "Back pain") {
      recs.push("Glute bridges and dead bugs build a safe foundation.");
      cautions.push("Avoid loaded spinal flexion (heavy crunches, weighted toe touches).");
    } else if (c.type === "Post-injury") {
      recs.push("Progressive overload — add reps before adding load.");
      cautions.push("Stop any movement that triggers sharp pain, not just fatigue.");
    } else if (c.type === "Chronic condition") {
      recs.push("Lower intensity, longer duration tends to be safest.");
      cautions.push("Always have water and meds within reach during sessions.");
    }
    if (c.avoidances) cautions.push(c.avoidances);
  }
  return { recs: [...new Set(recs)].slice(0, 3), cautions: [...new Set(cautions)].slice(0, 3) };
}

export function HealthConsiderationsPanel() {
  const profile = useApp((s) => s.healthProfile);
  const expanded = useApp((s) => s.healthPanelExpanded);
  const toggle = useApp((s) => s.toggleHealthPanel);
  const { recs, cautions } = useMemo(() => buildRecs(profile.conditions), [profile]);

  if (!profile.hasConditions || profile.conditions.length === 0) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        background: "rgba(245,82,42,0.06)",
        border: "1px solid rgba(245,82,42,0.15)",
      }}
    >
      <button
        onClick={toggle}
        className="w-full px-5 py-3.5 flex items-center justify-between transition-colors"
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,82,42,0.04)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <div className="flex items-center gap-2.5">
          <ShieldAlert size={15} style={{ color: "#F5522A" }} />
          <span className="text-sm font-bold" style={{ color: "#F5522A" }}>
            Health considerations for today
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          style={{ color: "rgba(245,82,42,0.6)" }}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4" style={{ borderTop: "1px solid rgba(245,82,42,0.1)" }}>
              <div
                className="text-[11px] uppercase tracking-wider mb-2 mt-3 font-bold flex items-center gap-1.5"
                style={{ color: "#D6E800" }}
              >
                <CheckCircle size={12} /> Recommended for you
              </div>
              <ul className="flex flex-col gap-1.5">
                {recs.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#D6E800" }} />
                    <span style={{ color: "rgba(242,240,233,0.65)" }}>{r}</span>
                  </li>
                ))}
              </ul>

              <div
                className="text-[11px] uppercase tracking-wider mb-2 mt-4 font-bold flex items-center gap-1.5"
                style={{ color: "#F5522A" }}
              >
                <AlertTriangle size={12} /> Move mindfully
              </div>
              <ul className="flex flex-col gap-1.5">
                {cautions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#F5522A" }} />
                    <span style={{ color: "rgba(242,240,233,0.65)" }}>{c}</span>
                  </li>
                ))}
              </ul>

              <div
                className="mt-4 pt-3 text-xs italic"
                style={{ borderTop: "1px solid rgba(245,82,42,0.1)", color: "rgba(242,240,233,0.35)" }}
              >
                These are AI suggestions, not medical advice. Always follow your doctor's guidance.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
