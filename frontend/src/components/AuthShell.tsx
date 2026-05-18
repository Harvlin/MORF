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
    <div className="dark bg-[#0f0f0e] text-white min-h-dvh font-sans relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
          type="video/mp4"
        />
      </video>
      <div
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(135deg, #0f0f0e 0%, #1a1917 50%, #0d1f15 100%)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/55 z-[1]" aria-hidden />

      <Link
        to="/"
        className="absolute top-5 left-5 z-20 liquid-glass rounded-full w-10 h-10 grid place-items-center text-white/85 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
      </Link>

      <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-5 py-12">
        <div className="flex items-center gap-2 mb-6 text-white">
          <span className="text-[#F06B4F]">
            <Logo size={28} />
          </span>
          <span className="font-semibold text-xl tracking-tight">MORF</span>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="liquid-glass-strong rounded-3xl p-8 w-full max-w-md"
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
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`w-full h-12 bg-white/5 rounded-xl pl-10 ${rightSlot ? "pr-12" : "pr-4"} text-sm text-white placeholder:text-white/40 outline-none transition-all ring-2 ${error ? "ring-red-400/60" : "ring-transparent focus:ring-[#F06B4F]/50"} border-none`}
      />
      {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
    </div>
  );
}

export function AuthLabel({ children }: { children: ReactNode }) {
  return <label className="text-xs font-medium text-white/65 mb-1.5 block">{children}</label>;
}
