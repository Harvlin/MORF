import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MORF — Move beyond your limits with AI" },
      { name: "description", content: "AI-powered inclusive sports platform for beginners, women, and people with accessibility needs." },
      { property: "og:title", content: "MORF — Move beyond your limits with AI" },
      { property: "og:description", content: "Sport is for everyone. Adaptive coaching, real community, movement that respects your body." },
    ],
  }),
  component: LandingPage,
});

const Logo = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M16 4 L28 28 L22 28 L16 14 L10 28 L4 28 Z" fill="currentColor" />
    <path d="M11.5 22 L20.5 22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

function LandingPage() {
  return (
    <div className="dark landing-page landing-minimal text-white min-h-dvh font-sans flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 lg:px-12 py-16 text-center">
        <div className="max-w-4xl">
          <h1 className="hero-magazine text-5xl sm:text-6xl lg:text-7xl leading-[1.05]">
            <span className="hero-highlight">
              Move <em>beyond</em>
            </span>
            <br />
            <span className="hero-highlight">
              your limits with <em>AI</em>
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
            <span className="hero-subline">
              Adaptive coaching, considered movement analysis, and a community built for every body.
            </span>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] px-6 py-8 bg-[#0a0a09]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/55">
        <div className="flex items-center gap-2 text-white/80">
          <span className="text-[#F06B4F]"><Logo size={20} /></span>
          <span className="font-semibold tracking-tight">MORF</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Community</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="text-xs text-white/40">© 2026 MORF</div>
      </div>
    </footer>
  );
}
