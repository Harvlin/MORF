import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
          className="bg-surface border border-border rounded-2xl p-4 flex gap-3 items-start shadow-[var(--shadow-soft)]"
        >
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{activeNudge.headline}</div>
            <div className="text-sm text-text-2 mt-0.5">{activeNudge.message}</div>
            <Link
              to={activeNudge.ctaLink}
              className="inline-block mt-3 text-sm font-semibold text-primary hover:underline"
            >
              {activeNudge.cta} →
            </Link>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-3 text-text-2 shrink-0 -mt-1 -mr-1"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
