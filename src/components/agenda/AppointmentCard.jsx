import { Bot, User, X } from "lucide-react";
import { formatCurrencyBRL } from "@/utils/dateHelpers";

const STATUS_CLASS = {
  confirmado: "bg-pine/10 text-pine",
  concluido: "bg-sage/15 text-sage",
  cancelado: "bg-rose/15 text-rose",
};

const STATUS_LABEL = {
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export default function AppointmentCard({ appointment, onCancel }) {
  const a = appointment;
  return (
    <div className="rounded-xl border border-line bg-card p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold text-ink">
            {a.start} – {a.end}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">{a.clientName}</p>
          <p className="text-xs text-ink/50">{a.serviceName}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASS[a.status]}`}>
            {STATUS_LABEL[a.status]}
          </span>
          <span className="font-mono text-xs text-ink/50">{formatCurrencyBRL(a.price)}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-2">
        <div className="flex items-center gap-1.5 text-xs text-ink/40">
          {a.source === "ia" ? <Bot className="h-3.5 w-3.5 text-gold" /> : <User className="h-3.5 w-3.5" />}
          {a.source === "ia" ? "Agendado pela IA" : "Agendado manualmente"}
        </div>
        {a.status === "confirmado" && onCancel && (
          <button
            onClick={() => onCancel(a.id)}
            className="flex items-center gap-1 text-xs text-rose/70 hover:text-rose"
          >
            <X className="h-3 w-3" /> cancelar
          </button>
        )}
      </div>
    </div>
  );
}
