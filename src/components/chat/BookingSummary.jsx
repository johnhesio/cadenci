import { CheckCircle2, Circle } from "lucide-react";
import { formatDateLong, formatCurrencyBRL } from "@/utils/dateHelpers";

function Row({ done, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      {done ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-ink/20" />
      )}
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-ink/40">{label}</p>
        <p className={`truncate text-sm ${done ? "font-medium text-ink" : "text-ink/30"}`}>{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default function BookingSummary({ draft }) {
  return (
    <div className="rounded-xl border border-line bg-card p-5 shadow-soft">
      <h3 className="mb-4 font-display text-base font-semibold text-ink">Resumo do agendamento</h3>
      <div className="space-y-4">
        <Row done={!!draft.service} label="Serviço" value={draft.service?.name} />
        <Row done={!!draft.date} label="Data" value={draft.date ? formatDateLong(draft.date) : null} />
        <Row done={!!draft.time} label="Horário" value={draft.time} />
        <Row done={!!draft.name} label="Cliente" value={draft.name} />
        <Row done={!!draft.whatsapp} label="WhatsApp" value={draft.whatsapp} />
      </div>
      {draft.service && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">Valor</p>
          <p className="font-mono text-lg font-semibold text-pine">{formatCurrencyBRL(draft.service.price)}</p>
        </div>
      )}
    </div>
  );
}
