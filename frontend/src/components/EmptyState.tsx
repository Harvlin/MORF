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
    <div className="text-center py-12 px-6">
      {icon && <div className="mx-auto mb-4">{icon}</div>}
      <h3 className="font-semibold text-base">{title}</h3>
      {description && <p className="text-sm opacity-70 mt-1.5 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function CrowdIllustration() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden>
      <circle cx="30" cy="35" r="14" fill="var(--color-primary-light)" />
      <circle cx="60" cy="28" r="16" fill="var(--color-secondary-light)" />
      <circle cx="90" cy="35" r="14" fill="var(--color-primary-light)" />
      <rect x="14" y="48" width="32" height="24" rx="6" fill="var(--color-primary-light)" />
      <rect x="44" y="42" width="32" height="30" rx="6" fill="var(--color-secondary-light)" />
      <rect x="74" y="48" width="32" height="24" rx="6" fill="var(--color-primary-light)" />
    </svg>
  );
}
