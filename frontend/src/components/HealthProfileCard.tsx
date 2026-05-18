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
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-surface-2 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <HeartPulse size={16} className="text-primary" />
          <span className="text-sm font-medium text-text-1">Health Profile</span>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="text-[11px] font-medium text-text-2 bg-surface-3 px-2 h-5 inline-flex items-center rounded-full">
              {count} condition{count > 1 ? "s" : ""}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-text-3 transition-transform ${open ? "rotate-180" : ""}`}
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
            <div className="border-t border-border">
              {!profile.hasConditions || count === 0 ? (
                <div className="px-5 py-4 text-sm text-text-3 italic">
                  No conditions added. Athena will give general recommendations.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {profile.conditions.map((c, i) => {
                    const detailParts: string[] = [];
                    const Icon = conditionIcons[c.type];
                    for (const v of Object.values(c.details)) {
                      if (Array.isArray(v)) detailParts.push(v.join(", "));
                      else if (v) detailParts.push(String(v));
                    }
                    detailParts.push(c.severity.charAt(0).toUpperCase() + c.severity.slice(1));
                    return (
                      <div key={i} className="px-5 py-3.5">
                        <div className="flex items-start gap-3">
                          {Icon ? (
                            <span className="text-text-2 mt-0.5">
                              <Icon size={16} />
                            </span>
                          ) : (
                            <span className="text-text-2 mt-0.5">•</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-text-1">{c.type}</div>
                            <div className="text-xs text-text-2 mt-0.5">
                              {detailParts.join(" · ")}
                            </div>
                            {c.avoidances && (
                              <div className="bg-surface-2 rounded-lg px-3 py-2 text-xs text-text-2 mt-2 flex items-start gap-2">
                                <AlertTriangle
                                  size={13}
                                  className="text-amber-500 mt-0.5 flex-shrink-0"
                                />
                                <span>{c.avoidances}</span>
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
                className="px-5 py-3 border-t border-border text-sm text-primary hover:bg-surface-2 flex items-center justify-between transition-colors"
              >
                <span>Update health profile</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
