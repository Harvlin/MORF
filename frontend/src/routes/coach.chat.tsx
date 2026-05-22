import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ArrowUp, HeartPulse } from "lucide-react";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { ChatBubble } from "@/components/ChatBubble";
import { chatHistory, suggestedPrompts, type ChatMessage } from "@/lib/mock-data";

export const Route = createFileRoute("/coach/chat")({
  head: () => ({ meta: [{ title: "Coach Chat — MORF" }] }),
  component: ChatPage,
});

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: String(Date.now()), role: "user", text, ts }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          role: "ai",
          text: "Got it. Based on your pattern this week, **recommendations**:\n\n- Rest major muscle groups for 24 hours\n- Do 10 minutes of mobility\n- Extra hydration today\n\nWant me to set up a mobility session?",
          ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1100);
  };

  return (
    <div
      className="flex flex-col h-dvh"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 15% 0%, rgba(214,232,0,0.05) 0%, transparent 60%), linear-gradient(175deg, #1E1E1B 0%, #181816 100%)",
      }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3"
        style={{
          background: "rgba(30,30,27,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(242,240,233,0.07)",
        }}
      >
        <Link
          to="/coach"
          className="w-10 h-10 -ml-2 grid place-items-center rounded-xl transition-colors"
          style={{ color: "rgba(242,240,233,0.6)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(242,240,233,0.07)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
        <div
          className="w-9 h-9 rounded-full grid place-items-center font-bold relative"
          style={{ background: "#6B5FC3", color: "#F2F0E9" }}
        >
          M
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2"
            style={{ background: "#22C55E", ringColor: "rgba(24,24,22,0.9)" }}
          />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm flex items-center gap-2" style={{ color: "#F2F0E9" }}>
            MORF Coach
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{ background: "rgba(107,95,195,0.1)", color: "#6B5FC3", border: "1px solid rgba(107,95,195,0.2)" }}
            >
              AI
            </span>
          </div>
          <div className="text-[11px] font-medium" style={{ color: "rgba(242,240,233,0.4)" }}>
            Online · responds instantly
          </div>
        </div>
        <HealthBadge />
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5 no-scrollbar">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {typing && (
          <div
            className="flex gap-1.5 px-5 py-4 w-fit rounded-2xl rounded-bl-sm"
            style={{ background: "rgba(242,240,233,0.06)", border: "1px solid rgba(242,240,233,0.08)" }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: "#6B5FC3" }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        className="px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
        style={{
          background: "rgba(24,24,22,0.92)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(242,240,233,0.07)",
        }}
      >
        {messages[messages.length - 1]?.role === "ai" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 -mx-1 px-1">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="shrink-0 text-[13px] px-4 py-2 rounded-full font-semibold transition-all"
                style={{
                  background: "rgba(242,240,233,0.06)",
                  color: "rgba(242,240,233,0.65)",
                  border: "1px solid rgba(242,240,233,0.1)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(245,82,42,0.1)";
                  e.currentTarget.style.color = "#F5522A";
                  e.currentTarget.style.borderColor = "rgba(245,82,42,0.25)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(242,240,233,0.06)";
                  e.currentTarget.style.color = "rgba(242,240,233,0.65)";
                  e.currentTarget.style.borderColor = "rgba(242,240,233,0.1)";
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message MORF..."
            className="flex-1 rounded-full px-5 h-12 text-[15px] font-medium focus:outline-none transition-all"
            style={{
              background: "rgba(242,240,233,0.06)",
              border: "1px solid rgba(242,240,233,0.1)",
              color: "#F2F0E9",
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = "rgba(107,95,195,0.35)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(107,95,195,0.06)";
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = "rgba(242,240,233,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 shrink-0 rounded-full grid place-items-center disabled:opacity-30 hover:opacity-90 active:scale-90 transition-all"
            style={{ background: "#F5522A", color: "#F2F0E9", boxShadow: input.trim() ? "0 0 20px rgba(245,82,42,0.3)" : "none" }}
            aria-label="Send"
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
}

function HealthBadge() {
  const hp = useApp((s) => s.healthProfile);
  if (!hp.hasConditions || hp.conditions.length === 0) return null;
  return (
    <span
      className="w-9 h-9 grid place-items-center rounded-full transition-colors"
      title="Health profile active"
      style={{ background: "rgba(107,95,195,0.12)", color: "#8B80D4" }}
    >
      <HeartPulse size={16} />
    </span>
  );
}
