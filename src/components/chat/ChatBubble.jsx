import { Music } from "lucide-react";

export default function ChatBubble({ role, text }) {
  const isBot = role === "bot";
  return (
    <div className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-pine-dark">
          <Music className="h-3.5 w-3.5" />
        </span>
      )}
      <div
        className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot
            ? "rounded-bl-sm border border-line bg-card text-ink"
            : "rounded-br-sm bg-pine text-paper"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
