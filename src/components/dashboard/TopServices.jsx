import { formatCurrencyBRL } from "@/utils/dateHelpers";

export default function TopServices({ items }) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="rounded-xl border border-line bg-card p-5 shadow-soft">
      <h3 className="font-display text-base font-semibold text-ink">Top serviços</h3>
      <p className="mb-4 text-xs text-ink/50">Por volume de agendamentos</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.serviceId}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="font-medium text-ink">{item.name}</span>
              <span className="font-mono text-xs text-ink/50">{formatCurrencyBRL(item.revenue)}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-line/60">
              <div
                className="h-full rounded-full bg-sage"
                style={{ width: `${Math.max((item.count / max) * 100, 6)}%` }}
              />
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-ink/40">Nenhum agendamento ainda.</p>}
      </ul>
    </div>
  );
}
