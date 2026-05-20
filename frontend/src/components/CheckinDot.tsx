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
        <span className="text-[14px] font-medium flex items-center gap-2" style={{ color: "#0f2420" }}>
          <span aria-hidden style={{ color: "#6e9e96" }}>
            {icon}
          </span>
          {label}
        </span>
        <span className="text-[11px]" style={{ color: "#6e9e96" }}>
          {value > 0 ? `${value}/5` : "Tap to rate"}
        </span>
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
                "flex-1 flex items-center justify-center transition-all duration-150 active:scale-95 text-[13px] font-medium",
              )}
              style={{
                height: "40px",
                borderRadius: "10px",
                border: filled ? "none" : "1px solid rgba(255,255,255,0.50)",
                background: filled ? "#1a3d35" : "rgba(255,255,255,0.60)",
                color: filled ? "#ffffff" : "#3d6058",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
