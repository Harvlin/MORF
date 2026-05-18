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
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold grid place-items-center">
              A
            </div>
            <span className="text-[11px] text-text-2 font-medium">Athena</span>
          </div>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-surface-3 text-text-1 rounded-bl-md",
          )}
        >
          <FormattedText text={message.text} className={isUser ? "text-primary-foreground" : ""} />
        </div>
        <span className={cn("text-[10px] text-text-3 px-1", isUser ? "text-right" : "")}>
          {message.ts}
        </span>
      </div>
    </div>
  );
}
