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
      className="rounded-xl overflow-hidden mb-4 border border-amber-200 dark:border-amber-800/30"
      style={{ background: "color-mix(in oklab, var(--color-warning) 10%, transparent)" }}
    >
      <button
        onClick={toggle}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-amber-100/30 dark:hover:bg-amber-900/10 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
            Health considerations for today
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-amber-700 dark:text-amber-400 transition-transform ${expanded ? "rotate-180" : ""}`}
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
            <div className="px-5 pb-4">
              <div className="text-[11px] text-text-3 uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5">
                <CheckCircle size={12} className="text-secondary" />
                <span>Recommended for you</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {recs.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-2">
                    <CheckCircle size={14} className="text-secondary flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              <div className="text-[11px] text-text-3 uppercase tracking-wider mb-2 mt-4 font-medium flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-amber-500" />
                <span>Move mindfully</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {cautions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-2">
                    <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-800/20 text-xs italic text-amber-700/70 dark:text-amber-400/60">
                These are AI suggestions, not medical advice. Always follow your doctor's guidance.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
