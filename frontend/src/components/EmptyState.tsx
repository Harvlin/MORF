import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6">
      {icon && <div className="mx-auto mb-5">{icon}</div>}
      <h3 className="font-bold text-base" style={{ color: "#F2F0E9" }}>{title}</h3>
      {description && (
        <p className="text-sm mt-1.5 max-w-sm mx-auto" style={{ color: "rgba(242,240,233,0.45)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function CrowdIllustration() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden>
      <circle cx="30" cy="35" r="14" fill="rgba(214,232,0,0.12)" />
      <circle cx="60" cy="28" r="16" fill="rgba(107,95,195,0.15)" />
      <circle cx="90" cy="35" r="14" fill="rgba(245,82,42,0.12)" />
      <rect x="14" y="48" width="32" height="24" rx="6" fill="rgba(214,232,0,0.08)" />
      <rect x="44" y="42" width="32" height="30" rx="6" fill="rgba(107,95,195,0.1)" />
      <rect x="74" y="48" width="32" height="24" rx="6" fill="rgba(245,82,42,0.08)" />
      {/* Accent dots */}
      <circle cx="30" cy="35" r="5" fill="rgba(214,232,0,0.4)" />
      <circle cx="60" cy="28" r="6" fill="rgba(107,95,195,0.5)" />
      <circle cx="90" cy="35" r="5" fill="rgba(245,82,42,0.4)" />
    </svg>
  );
}
