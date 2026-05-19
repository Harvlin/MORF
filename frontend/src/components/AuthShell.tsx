import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

const Logo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 4 L28 28 L22 28 L16 14 L10 28 L4 28 Z" fill="currentColor" />
    <path d="M11.5 22 L20.5 22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-dvh font-sans relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 -left-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-secondary/12 blur-3xl"
        aria-hidden
      />

      <Link
        to="/"
        className="absolute top-5 left-5 z-20 bg-surface border border-border rounded-full w-10 h-10 grid place-items-center text-text-2 hover:text-text-1 transition-colors"
      >
        <ArrowLeft size={16} />
      </Link>

      <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-5 py-12">
        <div className="flex items-center gap-2 mb-6 text-foreground">
          <span className="text-primary">
            <Logo size={28} />
          </span>
          <span className="font-semibold text-xl tracking-tight">MORF</span>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-surface border border-border rounded-3xl p-8 w-full max-w-md shadow-[0_24px_50px_-38px_rgba(20,18,14,0.6)]"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function AuthInput({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  rightSlot,
  error,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  rightSlot?: ReactNode;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`w-full h-12 bg-surface-2 rounded-xl pl-10 ${
          rightSlot ? "pr-12" : "pr-4"
        } text-sm text-foreground placeholder:text-text-3 outline-none transition-all border ring-2 ${
          error
            ? "border-destructive ring-destructive/20"
            : "border-border ring-transparent focus:ring-primary/30"
        }`}
      />
      {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
    </div>
  );
}

export function AuthLabel({ children }: { children: ReactNode }) {
  return <label className="text-xs font-medium text-text-2 mb-1.5 block">{children}</label>;
}
