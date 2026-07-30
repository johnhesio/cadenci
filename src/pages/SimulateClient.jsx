import { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import PageHeader from "@/components/layout/PageHeader";
import ChatBubble from "@/components/chat/ChatBubble";
import QuickReplies from "@/components/chat/QuickReplies";
import ChatComposer from "@/components/chat/ChatComposer";
import BookingSummary from "@/components/chat/BookingSummary";
import { useChatSimulator } from "@/hooks/useChatSimulator";

export default function SimulateClient() {
  const { messages, draft, handleQuickReply, handleUserText, composerPlaceholder, composerDisabled } =
    useChatSimulator();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const lastBotMessage = [...messages].reverse().find((m) => m.role === "bot");

  return (
    <div>
      <PageHeader
        title="Simular cliente"
        subtitle="Converse como se fosse um cliente no WhatsApp — o motor de regras cuida do resto"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <div className="flex h-[640px] flex-col rounded-xl border border-line bg-card shadow-soft">
            <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-5">
              {messages.map((m) => (
                <div key={m.id} className="space-y-2">
                  <ChatBubble role={m.role} text={m.text} />
                  {m.role === "bot" && m === lastBotMessage && (
                    <QuickReplies options={m.quickReplies} onSelect={handleQuickReply} />
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="border-t border-line p-4">
              <ChatComposer onSend={handleUserText} placeholder={composerPlaceholder} disabled={composerDisabled} />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} lg={4}>
          <BookingSummary draft={draft} />
        </Grid>
      </Grid>
    </div>
  );
}
