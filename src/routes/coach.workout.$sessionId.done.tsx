import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { todayWorkout } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/coach/workout/$sessionId/done")({
  component: DonePage,
});

function DonePage() {
  const [feedback, setFeedback] = useState<string>();
  const [note, setNote] = useState("");

  return (
    <div className="min-h-dvh bg-background flex flex-col px-5 py-8">
      <div className="flex-1 flex flex-col items-center text-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-secondary text-secondary-foreground grid place-items-center mb-6"
        >
          <Check size={48} strokeWidth={3} />
        </motion.div>
        <h1 className="text-4xl font-semibold mb-2">Workout complete!</h1>
        <p className="text-text-2 mb-8">You worked out for 32 minutes. Real progress.</p>

        <div className="bg-surface border border-border rounded-2xl p-5 w-full mb-5">
          <div className="text-xs uppercase tracking-widest text-text-2 mb-2">Completion</div>
          <div className="text-3xl font-semibold mb-3">
            {todayWorkout.exercises.length} of {todayWorkout.exercises.length}
          </div>
          <div className="grid grid-cols-3 gap-3 text-left mt-5">
            <Stat label="Exercises" value={String(todayWorkout.exercises.length)} />
            <Stat
              label="Sets done"
              value={String(todayWorkout.exercises.reduce((a, e) => a + e.sets, 0))}
            />
            <Stat label="Rest" value="6m" />
          </div>
        </div>

        <div className="w-full mb-5">
          <div className="text-sm font-medium mb-2.5">How did that feel?</div>
          <div className="grid grid-cols-3 gap-2">
            {["Too easy", "Just right", "Too hard"].map((f) => (
              <button
                key={f}
                onClick={() => setFeedback(f)}
                className={cn(
                  "h-12 rounded-xl text-sm font-semibold border-2 transition-all active:scale-95",
                  feedback === f
                    ? "bg-primary-light border-primary text-primary"
                    : "bg-surface border-border",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <textarea
          placeholder="Notes (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm resize-none mb-5 focus:outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-3 max-w-md mx-auto w-full">
        <Link
          to="/dashboard"
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Save & finish
        </Link>
        <Link to="/dashboard" className="block text-center text-sm text-text-2 hover:text-text-1">
          Back to home
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xl font-semibold tabular">{value}</div>
      <div className="text-[10px] text-text-2 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
