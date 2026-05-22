import { motion, AnimatePresence } from "framer-motion";
import { useState, type ComponentType } from "react";
import {
  HeartPulse,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Activity,
  Accessibility,
  ShieldAlert,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";

const conditionIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  "Joint issues": Accessibility,
  "Back pain": Activity,
  "Post-injury": ShieldAlert,
  "Chronic condition": HeartPulse,
};

export function HealthProfileCard() {
  const profile = useApp((s) => s.healthProfile);
  const [open, setOpen] = useState(false);
  const count = profile.conditions.length;

  return (
    <div className="card-frosted overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between transition-colors"
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.04)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <div className="flex items-center gap-2.5">
          <HeartPulse size={16} style={{ color: "#6B5FC3" }} />
          <span className="text-sm font-bold" style={{ color: "#F2F0E9" }}>Health Profile</span>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span
              className="text-[11px] font-bold px-2 h-5 inline-flex items-center rounded-full"
              style={{ background: "rgba(107,95,195,0.12)", color: "#8B80D4", border: "1px solid rgba(107,95,195,0.2)" }}
            >
              {count} condition{count > 1 ? "s" : ""}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
            style={{ color: "rgba(242,240,233,0.35)" }}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div style={{ borderTop: "1px solid rgba(242,240,233,0.07)" }}>
              {!profile.hasConditions || count === 0 ? (
                <div className="px-5 py-4 text-sm italic" style={{ color: "rgba(242,240,233,0.4)" }}>
                  No conditions added. MORF will give general recommendations.
                </div>
              ) : (
                <div>
                  {profile.conditions.map((c, i) => {
                    const detailParts: string[] = [];
                    const Icon = conditionIcons[c.type];
                    for (const v of Object.values(c.details)) {
                      if (Array.isArray(v)) detailParts.push(v.join(", "));
                      else if (v) detailParts.push(String(v));
                    }
                    detailParts.push(c.severity.charAt(0).toUpperCase() + c.severity.slice(1));
                    return (
                      <div
                        key={i}
                        className="px-5 py-3.5"
                        style={{ borderBottom: "1px solid rgba(242,240,233,0.05)" }}
                      >
                        <div className="flex items-start gap-3">
                          {Icon ? (
                            <span className="mt-0.5" style={{ color: "#6B5FC3" }}>
                              <Icon size={16} />
                            </span>
                          ) : (
                            <span className="mt-0.5" style={{ color: "#6B5FC3" }}>•</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold" style={{ color: "#F2F0E9" }}>{c.type}</div>
                            <div className="text-xs mt-0.5" style={{ color: "rgba(242,240,233,0.5)" }}>
                              {detailParts.join(" · ")}
                            </div>
                            {c.avoidances && (
                              <div
                                className="rounded-xl px-3 py-2 text-xs mt-2 flex items-start gap-2"
                                style={{ background: "rgba(245,82,42,0.06)", border: "1px solid rgba(245,82,42,0.12)" }}
                              >
                                <AlertTriangle
                                  size={13}
                                  className="mt-0.5 flex-shrink-0"
                                  style={{ color: "#F5522A" }}
                                />
                                <span className="font-medium" style={{ color: "rgba(242,240,233,0.7)" }}>
                                  {c.avoidances}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link
                to="/onboarding/reassess"
                className="px-5 py-3 text-sm flex items-center justify-between transition-colors"
                style={{
                  borderTop: "1px solid rgba(242,240,233,0.07)",
                  color: "#D6E800",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(214,232,0,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span className="font-semibold">Update health profile</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
