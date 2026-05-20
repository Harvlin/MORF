import type { ChatMessage } from "@/lib/mock-data";
import { FormattedText } from "./FormattedText";
import { cn } from "@/lib/utils";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]">
        {!isUser && (
          <div className="flex items-center gap-2 px-1 text-[var(--foreground)]">
            <div className="w-5 h-5 rounded-full bg-[#1a3d35] text-white text-[10px] font-bold grid place-items-center shadow-sm">
              M
            </div>
            <span className="text-[11px] opacity-70 font-bold uppercase tracking-widest">MORF Coach</span>
          </div>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-sm text-[15px]",
            isUser
              ? "bg-[#1a3d35] text-white rounded-br-md"
              : "card-frosted !text-[#0f2420] rounded-bl-md font-medium",
          )}
        >
          <FormattedText text={message.text} className={isUser ? "text-white" : ""} />
        </div>
        <span className={cn("text-[10px] opacity-50 px-1 font-medium", isUser ? "text-right text-white" : "text-[var(--foreground)]")}>
          {message.ts}
        </span>
      </div>
    </div>
  );
}
