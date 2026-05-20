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
    <div className="flex flex-col h-dvh">
      <header className="flex items-center gap-3 px-4 py-3 bg-[rgba(255,255,255,0.45)] backdrop-blur-md border-b border-[rgba(255,255,255,0.6)]">
        <Link
          to="/coach"
          className="w-10 h-10 -ml-2 grid place-items-center rounded-lg hover:bg-[rgba(255,255,255,0.4)] text-[var(--foreground)]"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="w-9 h-9 rounded-full bg-[#1a3d35] text-white grid place-items-center font-semibold relative shadow-lg">
          M
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#f47c3c] ring-2 ring-white" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm flex items-center gap-2 text-[var(--foreground)]">
            MORF Coach
            <span className="text-[9px] font-bold bg-[rgba(26,61,53,0.15)] text-[#1a3d35] px-1.5 py-0.5 rounded uppercase tracking-wider">
              AI
            </span>
          </div>
          <div className="text-[11px] text-[var(--foreground)] opacity-60">Online · responds instantly</div>
        </div>
        <HealthBadge />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {typing && (
          <div className="flex gap-1.5 px-5 py-4 card-frosted rounded-2xl w-fit rounded-bl-md">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#1a3d35]"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-[rgba(255,255,255,0.45)] backdrop-blur-md border-t border-[rgba(255,255,255,0.6)] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {messages[messages.length - 1]?.role === "ai" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 -mx-1 px-1">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="shrink-0 text-[13px] bg-[rgba(255,255,255,0.7)] text-[#0f2420] border border-[rgba(255,255,255,0.8)] hover:bg-[#1a3d35] hover:text-white hover:border-[#1a3d35] shadow-sm px-4 py-2 rounded-full font-semibold transition-all"
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
            className="flex-1 bg-[rgba(255,255,255,0.7)] border border-white rounded-full px-5 h-12 text-[15px] text-[#0f2420] font-medium placeholder:text-[#0f2420] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1a3d35] shadow-inner transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 shrink-0 rounded-full bg-[#1a3d35] text-white grid place-items-center disabled:opacity-50 hover:opacity-90 active:scale-90 shadow-lg transition-all"
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
      title="Health profile active"
      className="w-9 h-9 grid place-items-center rounded-full bg-primary-light text-primary"
    >
      <HeartPulse size={16} />
    </span>
  );
}
