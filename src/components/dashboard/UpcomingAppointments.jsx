import { Bot, User } from "lucide-react";

const STATUS_LABEL = {
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const STATUS_CLASS = {
  confirmado: "bg-pine/10 text-pine",
  concluido: "bg-sage/15 text-sage",
  cancelado: "bg-rose/15 text-rose",
};

export default function UpcomingAppointments({ items }) {
  return (
    <div className="rounded-xl border border-line bg-card p-5 shadow-soft">
      <h3 className="font-display text-base font-semibold text-ink">Próximos atendimentos</h3>
      <p className="mb-4 text-xs text-ink/50">Hoje</p>
      <ul className="divide-y divide-line">
        {items.map((a) => (
          <li key={a.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="font-mono text-sm font-semibold text-ink/70">{a.start}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{a.clientName}</p>
              <p className="truncate text-xs text-ink/50">{a.serviceName}</p>
            </div>
            {a.source === "ia" ? (
              <Bot className="h-3.5 w-3.5 shrink-0 text-gold" title="Agendado pela IA" />
            ) : (
              <User className="h-3.5 w-3.5 shrink-0 text-ink/30" title="Agendado manualmente" />
            )}
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASS[a.status]}`}>
              {STATUS_LABEL[a.status]}
            </span>
          </li>
        ))}
        {items.length === 0 && <p className="py-4 text-sm text-ink/40">Sem atendimentos restantes hoje.</p>}
      </ul>
    </div>
  );
}
