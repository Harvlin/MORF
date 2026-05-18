import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CheckinDot({
  value,
  onChange,
  label,
  icon,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  icon: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium flex items-center gap-2">
          <span aria-hidden className="text-text-2">
            {icon}
          </span>
          {label}
        </span>
        <span className="text-xs text-text-3">{value > 0 ? `${value}/5` : "Tap to rate"}</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${label} ${n} of 5`}
              className={cn(
                "h-9 flex-1 rounded-lg border-2 transition-all duration-150",
                filled
                  ? "bg-primary border-primary scale-100 active:scale-95"
                  : "bg-transparent border-border hover:border-text-3 active:scale-95",
              )}
              style={filled ? { animation: "pop 0.2s ease-out" } : {}}
            />
          );
        })}
      </div>
    </div>
  );
}
