import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(label: string, max = 2) {
  const parts = label
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  return initials.slice(0, Math.max(1, max));
}
