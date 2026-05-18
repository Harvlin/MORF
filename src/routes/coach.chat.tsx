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
    <div className="flex flex-col h-dvh bg-background">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
        <Link
          to="/coach"
          className="w-10 h-10 -ml-2 grid place-items-center rounded-lg hover:bg-surface-3"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold relative">
          M
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-secondary ring-2 ring-surface" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm flex items-center gap-2">
            MORF Coach
            <span className="text-[9px] font-bold bg-primary-light text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">
              AI
            </span>
          </div>
          <div className="text-[11px] text-secondary">Online · responds instantly</div>
        </div>
        <HealthBadge />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {typing && (
          <div className="flex gap-1.5 px-4 py-3 bg-surface-3 rounded-2xl w-fit rounded-bl-md">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-text-3"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-surface px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {messages[messages.length - 1]?.role === "ai" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 -mx-1 px-1">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="shrink-0 text-xs bg-surface-3 hover:bg-primary-light hover:text-primary px-3 py-2 rounded-full font-medium transition-colors"
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
            className="flex-1 bg-surface-3 border-0 rounded-full px-5 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-11 h-11 rounded-full bg-primary text-primary-foreground grid place-items-center disabled:bg-surface-3 disabled:text-text-3 hover:opacity-90 active:scale-90 transition-all"
            aria-label="Send"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
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
