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
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.4)] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <HeartPulse size={16} className="text-[#1a3d35]" />
          <span className="text-sm font-semibold text-[#0f2420]">Health Profile</span>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="text-[11px] font-semibold text-[#0f2420] opacity-80 bg-[rgba(26,61,53,0.1)] px-2 h-5 inline-flex items-center rounded-full">
              {count} condition{count > 1 ? "s" : ""}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-[#0f2420] opacity-50 transition-transform ${open ? "rotate-180" : ""}`}
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
            <div className="border-t border-[rgba(15,36,32,0.1)]">
              {!profile.hasConditions || count === 0 ? (
                <div className="px-5 py-4 text-sm text-[#0f2420] opacity-60 italic">
                  No conditions added. Athena will give general recommendations.
                </div>
              ) : (
                <div className="divide-y divide-[rgba(15,36,32,0.1)]">
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
                            <span className="text-[#1a3d35] mt-0.5">
                              <Icon size={16} />
                            </span>
                          ) : (
                            <span className="text-[#1a3d35] mt-0.5">•</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[#0f2420]">{c.type}</div>
                            <div className="text-xs text-[#0f2420] opacity-70 mt-0.5">
                              {detailParts.join(" · ")}
                            </div>
                            {c.avoidances && (
                              <div className="bg-[rgba(26,61,53,0.05)] rounded-lg px-3 py-2 text-xs text-[#0f2420] opacity-80 mt-2 flex items-start gap-2">
                                <AlertTriangle
                                  size={13}
                                  className="text-amber-600 mt-0.5 flex-shrink-0"
                                />
                                <span className="font-medium">{c.avoidances}</span>
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
