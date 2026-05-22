import { motion, AnimatePresence } from "framer-motion";
import { Zap, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { activeNudge } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export function NudgeBanner() {
  const dismissed = useApp((s) => s.nudgeDismissed);
  const enabled = useApp((s) => s.smartReminders);
  const dismiss = useApp((s) => s.dismissNudge);

  return (
    <AnimatePresence>
      {!dismissed && enabled && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="card-frosted p-4 flex gap-3 items-start"
          style={{ borderColor: "rgba(214,232,0,0.15)" }}
        >
          <div
            className="w-9 h-9 rounded-xl grid place-items-center shrink-0"
            style={{ background: "rgba(214,232,0,0.12)", color: "#D6E800" }}
          >
            <Zap size={16} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm" style={{ color: "#F2F0E9" }}>
              {activeNudge.headline}
            </div>
            <div className="text-[13px] mt-0.5" style={{ color: "rgba(242,240,233,0.6)" }}>
              {activeNudge.message}
            </div>
            <Link
              to={activeNudge.ctaLink}
              className="inline-flex items-center gap-1 mt-3 text-[13px] font-bold transition-all"
              style={{ color: "#D6E800" }}
            >
              {activeNudge.cta} →
            </Link>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="w-7 h-7 grid place-items-center rounded-lg transition-colors shrink-0 -mt-0.5 -mr-0.5"
            style={{ color: "rgba(242,240,233,0.35)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.07)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
