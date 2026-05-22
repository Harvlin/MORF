import type { ChatMessage } from "@/lib/mock-data";
import { FormattedText } from "./FormattedText";
import { cn } from "@/lib/utils";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]">
        {!isUser && (
          <div className="flex items-center gap-2 px-1">
            <div
              className="w-5 h-5 rounded-full text-[10px] font-black grid place-items-center"
              style={{ background: "#D6E800", color: "#1C1C1A" }}
            >
              M
            </div>
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "rgba(242,240,233,0.4)" }}
            >
              MORF Coach
            </span>
          </div>
        )}
        <div
          className={cn("rounded-2xl px-4 py-3 text-[15px]", isUser ? "rounded-br-sm" : "rounded-bl-sm")}
          style={
            isUser
              ? {
                  background: "#D6E800",
                  color: "#1C1C1A",
                  boxShadow: "0 4px 16px rgba(214,232,0,0.15)",
                }
              : {
                  background: "rgba(242,240,233,0.06)",
                  border: "1px solid rgba(242,240,233,0.08)",
                  color: "#F2F0E9",
                }
          }
        >
          <FormattedText text={message.text} className={isUser ? "text-[#1C1C1A]" : "text-[#F2F0E9]"} />
        </div>
        <span
          className={cn("text-[10px] px-1 font-medium", isUser ? "text-right" : "")}
          style={{ color: "rgba(242,240,233,0.3)" }}
        >
          {message.ts}
        </span>
      </div>
    </div>
  );
}
